import { profile } from "@/content/site";

export default function Home() {
  return (
    <section className="mx-auto max-w-page px-margin py-section">
      <p className="label text-muted">{profile.role}</p>
      <h1 className="instance-display mt-6 text-display-1">{profile.name}</h1>
    </section>
  );
}
