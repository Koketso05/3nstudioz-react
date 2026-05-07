import { Link } from "react-router";

const TERMS_SECTIONS = [
  {
    title: "1. Booking Confirmation",
    paragraphs: [
      "A booking is only confirmed once:",
    ],
    bullets: [
      "The client has accepted the quotation or invoice.",
      "The required deposit has been paid.",
      "Proof of payment has been provided.",
    ],
    closing:
      "3NStudioz reserves the right to decline or cancel bookings where payment has not been received.",
  },
  {
    title: "2. Payment Terms",
    subsections: [
      {
        title: "Premium Packages",
        paragraphs: [
          "A 60% non-refundable deposit for all Premium Packages must be paid before 3NStudioz can attend or provide any photography or videography services.",
          "The remaining balance must be paid before or on the day of the event unless otherwise agreed in writing.",
        ],
      },
      {
        title: "Other Packages",
        paragraphs: [
          "For Standard and Basic Packages, a deposit may be required to secure the booking date.",
          "Failure to complete payment may result in cancellation of services and delayed delivery of final content.",
        ],
      },
    ],
  },
  {
    title: "3. Cancellation and Rescheduling",
    bullets: [
      "All cancellations must be made in writing via email or WhatsApp.",
      "Deposits are non-refundable because the booking date is reserved exclusively for the client.",
      "Rescheduling requests are subject to availability.",
      "If the new requested date is unavailable, the original booking will be treated as cancelled.",
      "3NStudioz reserves the right to charge additional fees for last-minute postponements or major schedule changes.",
    ],
  },
  {
    title: "4. Late Arrivals and Delays",
    paragraphs: ["Clients are responsible for ensuring that events start on time.", "If delays occur:"],
    bullets: [
      "Coverage time may be reduced accordingly.",
      "Additional hours requested by the client may result in extra charges.",
      "3NStudioz is not responsible for missed moments caused by lateness, poor planning, or restricted access.",
    ],
  },
  {
    title: "5. Delivery of Photos and Videos",
    bullets: [
      "Edited photos and videos will be delivered digitally via download link, cloud storage, or other agreed platforms.",
      "Delivery timelines may vary depending on workload, project size, and editing requirements.",
      "Estimated delivery timelines will be communicated to the client.",
    ],
    closing:
      "3NStudioz will make every reasonable effort to deliver content within the agreed timeframe.",
  },
  {
    title: "6. Editing and Creative Style",
    paragraphs: ["Clients acknowledge that:"],
    bullets: [
      "3NStudioz maintains full creative control over editing styles, colour grading, video effects, and final presentation.",
      "RAW/unedited files will not be provided unless agreed in writing.",
      "Final delivered work reflects the artistic style of 3NStudioz.",
    ],
  },
  {
    title: "7. Copyright and Usage",
    paragraphs: [
      "All photos, videos, and media produced by 3NStudioz remain the intellectual property of 3NStudioz unless otherwise agreed in writing.",
      "Clients may:",
    ],
    bullets: [
      "Share content on social media.",
      "Print and use content for personal purposes.",
    ],
    subBulletsTitle: "Clients may not:",
    subBullets: [
      "Resell the content.",
      "Edit or alter the content without permission.",
      "Use the content commercially without written approval.",
    ],
  },
  {
    title: "8. Portfolio and Marketing Use",
    paragraphs: ["3NStudioz reserves the right to use selected photos and videos for:"],
    bullets: [
      "Portfolio purposes",
      "Social media marketing",
      "Website galleries",
      "Advertising and promotional content",
    ],
    closing:
      "Clients who prefer their content to remain private must notify 3NStudioz in writing before the event date.",
  },
  {
    title: "9. Travel and Accommodation",
    paragraphs: [
      "Travel fees may apply for locations outside the normal operating area.",
      "If accommodation is required for distant events, the client may be responsible for reasonable accommodation arrangements or related costs.",
    ],
  },
  {
    title: "10. Equipment Failure and Force Majeure",
    paragraphs: [
      "While every effort is made to provide uninterrupted service, 3NStudioz shall not be held liable for circumstances beyond reasonable control, including:",
    ],
    bullets: [
      "Severe weather conditions",
      "Load shedding or power outages",
      "Accidents",
      "Venue restrictions",
      "Equipment malfunction",
      "Natural disasters",
      "Government restrictions",
    ],
    closing: "In such cases, liability will be limited to the amount paid by the client.",
  },
  {
    title: "11. Client Cooperation",
    paragraphs: ["Clients are responsible for:"],
    bullets: [
      "Providing accurate event details.",
      "Ensuring access to venues and locations.",
      "Informing guests and participants about photography and videography coverage.",
    ],
    closing:
      "3NStudioz is not responsible for compromised coverage caused by interference from guests, venue restrictions, or lack of cooperation.",
  },
  {
    title: "12. Acceptance of Terms",
    paragraphs: [
      "By making payment and confirming a booking, the client acknowledges that they have read, understood, and agreed to these Terms and Conditions.",
    ],
  },
];

export function TermsAndConditions() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Terms and Conditions</h1>
          <p className="text-white/60 text-lg">3NStudioz</p>
          <p className="text-white/50 text-sm mt-4">
            Welcome to 3NStudioz. By booking our photography and videography services, you agree to the terms below.
          </p>
        </div>

        <div className="space-y-8">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} className="bg-neutral-900 border border-white/10 p-6 md:p-8">
              <h2 className="text-2xl mb-4 text-yellow-400">{section.title}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-white/80 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}

              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="mb-4 last:mb-0">
                  <h3 className="text-xl mb-2">{subsection.title}</h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-white/80 leading-relaxed mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}

              {section.bullets && (
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.subBulletsTitle && (
                <p className="text-white/80 leading-relaxed mb-2">{section.subBulletsTitle}</p>
              )}

              {section.subBullets && (
                <ul className="list-disc list-inside space-y-2 text-white/80 mb-3">
                  {section.subBullets.map((bullet) => (
                    <li key={bullet} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.closing && <p className="text-white/80 leading-relaxed">{section.closing}</p>}
            </section>
          ))}
        </div>

        <section className="mt-10 bg-yellow-400/10 border border-yellow-400/30 p-6">
          <h2 className="text-xl mb-3 text-yellow-400">Important Premium Package Note</h2>
          <p className="text-white/90 leading-relaxed">
            Please note: A 60% non-refundable deposit is required for all Premium Packages before 3NStudioz can provide photography or videography services.
          </p>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/booking"
            className="inline-block px-8 py-3 bg-yellow-400 text-black hover:bg-yellow-500 transition-colors font-semibold"
          >
            Proceed to Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
