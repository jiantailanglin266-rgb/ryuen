import { shop } from "@/data/shop";
import { menuItems } from "@/data/menu";
import { faqItems } from "@/data/faq";

/**
 * JSON-LD 構造化データ。
 * WebSite / Restaurant(LocalBusiness) / BreadcrumbList / FAQPage を出力する。
 */
export default function StructuredData() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: shop.name,
    alternateName: shop.nameEn,
    url: shop.siteUrl,
    inLanguage: "ja",
  };

  const restaurant = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    "@id": `${shop.siteUrl}/#restaurant`,
    name: shop.name,
    alternateName: shop.nameEn,
    description: shop.description,
    url: shop.siteUrl,
    image: `${shop.siteUrl}/images/ogp.jpg`,
    telephone: shop.tel,
    servesCuisine: "かき氷",
    priceRange: "¥1,000-¥2,000",
    currenciesAccepted: "JPY",
    paymentAccepted: shop.payment,
    address: {
      "@type": "PostalAddress",
      postalCode: shop.address.postalCode,
      addressRegion: shop.address.prefecture,
      addressLocality: shop.address.city,
      streetAddress: `${shop.address.street} ${shop.address.building}`,
      addressCountry: "JP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: shop.geo.latitude,
      longitude: shop.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "20:00",
    },
    sameAs: [shop.instagramUrl],
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: {
        "@type": "MenuSection",
        name: "かき氷",
        hasMenuItem: menuItems.map((item) => ({
          "@type": "MenuItem",
          name: item.name,
          description: item.description,
          ...(item.priceValue
            ? {
                offers: {
                  "@type": "Offer",
                  price: item.priceValue,
                  priceCurrency: "JPY",
                },
              }
            : {}),
        })),
      },
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: shop.siteUrl,
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {[website, restaurant, breadcrumb, faq].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
