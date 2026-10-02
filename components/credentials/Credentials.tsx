import { certifications, education } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { formatIssued } from "@/lib/format";

export function Credentials() {
  return (
    <section id="credentials" aria-labelledby="credentials-title" className="border-b border-rule py-section">
      <div className="mx-auto max-w-page px-margin">
        <p className="label text-muted">05 · Certifications & education</p>
        <h2 id="credentials-title" className="mt-4 text-h2">
          Credentials
        </h2>
        <Reveal>
          <ul className="mt-12">
            {certifications.map((cert) => (
              <li key={cert.name} data-reveal className="grid grid-cols-1 gap-2 border-t border-rule py-5 lg:grid-cols-[minmax(0,1fr)_10rem_12rem_7rem_auto] lg:items-baseline lg:gap-6">
                <span className="text-h3 font-semibold">{cert.name}</span>
                <span className="label text-muted">{cert.kind}</span>
                <span className="text-small text-muted">{cert.issuer}</span>
                <span className="font-mono text-readout">{formatIssued(cert.issued)}</span>
                {cert.verifyUrl ? (
                  <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="group label hover:text-accent">
                    Verify <span aria-hidden="true" className="arrow">↗</span>
                    <span className="sr-only"> {cert.name} (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="font-mono text-readout text-muted [overflow-wrap:anywhere]">ID {cert.credentialId}</span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        {education.map((item) => (
          <div key={item.degree} className="mt-16 grid grid-cols-1 gap-4 border-t border-rule pt-8 lg:grid-cols-[1fr_auto] lg:items-baseline">
            <div>
              <h3 className="instance-display text-h2">{item.degree}</h3>
              <p className="mt-2 text-lead text-muted">{item.institution}</p>
              <p className="label mt-4 text-muted">Coursework · {item.coursework.join(" · ")}</p>
            </div>
            <div className="flex flex-col gap-1 font-mono text-readout lg:text-right">
              <span>
                {item.start} – {item.end}
              </span>
              <span>CGPA {item.cgpa}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
