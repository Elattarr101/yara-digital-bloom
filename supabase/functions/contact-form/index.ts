import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  full_name: string;
  email: string;
  company_name?: string;
  service_interested: string;
  budget_range: string;
  project_details: string;
  honeypot?: string; // Security field
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  console.log('Contact form submission received');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log('Form data received:', { ...formData, honeypot: '[HIDDEN]' });

    // Security: Check honeypot field (should be empty)
    if (formData.honeypot && formData.honeypot.trim() !== '') {
      console.log('Spam detected via honeypot');
      return new Response(
        JSON.stringify({ error: 'Spam detected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    const requiredFields = ['full_name', 'email', 'service_interested', 'budget_range', 'project_details'];
    for (const field of requiredFields) {
      if (!formData[field as keyof ContactFormData] || formData[field as keyof ContactFormData]?.toString().trim() === '') {
        console.log(`Missing required field: ${field}`);
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('Invalid email format');
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limiting: Check for recent submissions from same email
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentSubmissions, error: rateLimitError } = await supabase
      .from('contact_submissions')
      .select('id')
      .eq('email', formData.email)
      .gte('created_at', oneHourAgo);

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (recentSubmissions && recentSubmissions.length >= 3) {
      console.log('Rate limit exceeded for email:', formData.email);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please wait before submitting again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save to database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert([{
        full_name: formData.full_name,
        email: formData.email,
        company_name: formData.company_name || null,
        service_interested: formData.service_interested,
        budget_range: formData.budget_range,
        project_details: formData.project_details
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Submission saved successfully:', submission.id);

    // Get site URL from environment
    const siteUrl = Deno.env.get('SITE_URL') || 'https://tgzeogmauexqkvbsittb.supabase.co';
    
    // Sanitize HTML content to prevent XSS
    const sanitizeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${sanitizeHtml(formData.full_name)}</p>
          <p><strong>Email:</strong> ${sanitizeHtml(formData.email)}</p>
          ${formData.company_name ? `<p><strong>Company:</strong> ${sanitizeHtml(formData.company_name)}</p>` : ''}
          
          <h3>Project Details</h3>
          <p><strong>Service Interested:</strong> ${sanitizeHtml(formData.service_interested)}</p>
          <p><strong>Budget Range:</strong> ${sanitizeHtml(formData.budget_range)}</p>
          <p><strong>Project Details:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
            ${sanitizeHtml(formData.project_details).replace(/\n/g, '<br>')}
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Submission ID: ${submission.id}<br>
            Submitted: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    const { error: adminEmailError } = await resend.emails.send({
      from: `Yara Contact Form <${Deno.env.get('FROM_EMAIL') || 'contact@yaraagency.com'}>`,
      to: [Deno.env.get('ADMIN_EMAIL') || 'hello@yaraagency.com'],
      subject: `New Contact: ${sanitizeHtml(formData.full_name)} - ${sanitizeHtml(formData.service_interested)}`,
      html: adminEmailHtml,
    });

    if (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    } else {
      console.log('Admin notification sent successfully');
    }

    // Send confirmation email to user
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Thank you for contacting Yara!</h2>
        <p>Hi ${sanitizeHtml(formData.full_name)},</p>
        <p>We've received your inquiry about <strong>${sanitizeHtml(formData.service_interested)}</strong> and will get back to you within 24 hours.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Your Submission Summary:</h3>
          <p><strong>Service:</strong> ${sanitizeHtml(formData.service_interested)}</p>
          <p><strong>Budget Range:</strong> ${sanitizeHtml(formData.budget_range)}</p>
          ${formData.company_name ? `<p><strong>Company:</strong> ${sanitizeHtml(formData.company_name)}</p>` : ''}
        </div>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li><a href="${siteUrl}/portfolio" style="color: #8B5CF6;">Check out our portfolio</a></li>
          <li><a href="${siteUrl}/blog" style="color: #8B5CF6;">Read our latest blog posts</a></li>
          <li><a href="${siteUrl}/services" style="color: #8B5CF6;">Learn more about our services</a></li>
        </ul>
        
        <p>Best regards,<br>
        The Yara Team</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated confirmation. Please don't reply to this email.
        </p>
      </div>
    `;

    const { error: userEmailError } = await resend.emails.send({
      from: `Yara <${Deno.env.get('FROM_EMAIL') || 'hello@yaraagency.com'}>`,
      to: [formData.email],
      subject: 'Thank you for contacting Yara - We\'ll be in touch soon!',
      html: userEmailHtml,
    });

    if (userEmailError) {
      console.error('Failed to send user confirmation:', userEmailError);
    } else {
      console.log('User confirmation sent successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you! We\'ve received your message and will get back to you soon.',
        submissionId: submission.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Something went wrong. Please try again later.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);