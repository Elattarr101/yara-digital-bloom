interface StructuredDataProps {
  type: 'organization' | 'website' | 'article' | 'service' | 'breadcrumb' | 'faq';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    const baseContext = "https://schema.org";
    
    switch (type) {
      case 'organization':
        return {
          "@context": baseContext,
          "@type": "Organization",
          "name": "Yara Digital Marketing Agency",
          "url": "https://yourdomain.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://yourdomain.com/logo.png",
            "width": 300,
            "height": 100
          },
          "description": "Expert digital marketing, web design, and branding services that transform businesses",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "US",
            "addressRegion": data?.region || "California"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": data?.phone || "+1-555-0123",
              "email": data?.email || "hello@yaraagency.com",
              "url": "https://yourdomain.com/contact"
            }
          ],
          "sameAs": [
            "https://twitter.com/yaraagency",
            "https://linkedin.com/company/yaraagency",
            "https://facebook.com/yaraagency"
          ],
          "foundingDate": "2020",
          "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "value": "10-50"
          },
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 37.7749,
              "longitude": -122.4194
            },
            "geoRadius": "100 mi"
          }
        };

      case 'website':
        return {
          "@context": baseContext,
          "@type": "WebSite",
          "name": "Yara Digital Marketing Agency",
          "url": "https://yourdomain.com",
          "description": data?.description || "Expert digital marketing, web design, and branding services",
          "publisher": {
            "@type": "Organization",
            "name": "Yara Digital Marketing Agency"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://yourdomain.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        };

      case 'article':
        return {
          "@context": baseContext,
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": {
            "@type": "ImageObject",
            "url": data.image,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Person",
            "name": data.author,
            "url": `https://yourdomain.com/author/${data.author.toLowerCase().replace(' ', '-')}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "Yara Digital Marketing Agency",
            "logo": {
              "@type": "ImageObject",
              "url": "https://yourdomain.com/logo.png"
            }
          },
          "datePublished": data.publishedDate,
          "dateModified": data.modifiedDate || data.publishedDate,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          "keywords": data.keywords,
          "articleSection": data.category,
          "wordCount": data.wordCount || 1000
        };

      case 'service':
        return {
          "@context": baseContext,
          "@type": "Service",
          "name": data.name,
          "description": data.description,
          "provider": {
            "@type": "Organization",
            "name": "Yara Digital Marketing Agency"
          },
          "serviceType": data.type,
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Marketing Services",
            "itemListElement": data.services?.map((service: any, index: number) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": service.name,
                "description": service.description
              },
              "position": index + 1
            }))
          }
        };

      case 'breadcrumb':
        return {
          "@context": baseContext,
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };

      case 'faq':
        return {
          "@context": baseContext,
          "@type": "FAQPage",
          "mainEntity": data.questions.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      default:
        return {};
    }
  };

  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

export default StructuredData;