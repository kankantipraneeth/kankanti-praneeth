/** Window event asking Selected Work to bring one project's sheet into view (detail: the project slug). */
export const SHOW_WORK_EVENT = "work:show";

export function showWork(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(SHOW_WORK_EVENT, { detail: slug }));
}
