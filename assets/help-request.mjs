export const topics = Object.freeze({
  technical: 'Describe the task, error, and expected outcome. Remove personal information from copied URLs.',
  privacy: 'Identify the information and requested action. Do not include source documents or identity evidence.',
  accommodation: 'Describe the barrier and a helpful adjustment. Do not include a diagnosis or medical records.',
  recovery: 'Describe the access problem. Never include credentials, sign-in links, or authentication codes.',
  appeal: 'Identify the decision and disputed facts. Do not attach identity documents.',
  safety: 'Describe the incident and a redacted listing reference. Do not paste suspicious tokens or private messages.',
  employer: 'Identify the engagement and disputed item. Do not include bank or full payment details.'
});
export function validTopic(value) {
  return Object.hasOwn(topics, value) ? value : 'technical';
}
export function buildDraft({topic, summary, reference, details, access}) {
  if (!summary.trim() || !details.trim()) return null;
  return [
    'PREVIEW ONLY: NOT SUBMITTED',
    `Topic: ${validTopic(topic)}`,
    `Summary: ${summary.trim()}`,
    reference.trim() ? `Reference: ${reference.trim()}` : '',
    `Details: ${details.trim()}`,
    access.trim() ? `Access or communication needs: ${access.trim()}` : ''
  ].filter(Boolean).join('\n\n');
}
if (typeof document !== 'undefined') {
  const builder = document.querySelector('#request-builder');
  if (builder) {
    const type = document.querySelector('#request-type');
    const summary = document.querySelector('#request-summary');
    const reference = document.querySelector('#request-reference');
    const details = document.querySelector('#request-details');
    const access = document.querySelector('#request-access');
    const guidance = document.querySelector('#topic-guidance');
    const error = document.querySelector('#draft-error');
    const review = document.querySelector('#draft-review');
    const output = document.querySelector('#draft-output');
    type.value = validTopic(new URLSearchParams(location.search).get('type'));
    const update = () => {
      guidance.textContent = topics[type.value];
      review.hidden = true;
      output.textContent = '';
      error.textContent = '';
    };
    type.addEventListener('change', update);
    [summary, reference, details, access].forEach(field => field.addEventListener('input', () => {
      review.hidden = true;
      output.textContent = '';
      field.removeAttribute('aria-invalid');
      error.textContent = '';
    }));
    document.querySelector('#review-draft').addEventListener('click', () => {
      const draft = buildDraft({topic:type.value, summary:summary.value, reference:reference.value, details:details.value, access:access.value});
      if (!draft) {
        error.textContent = 'Add a short summary and details using fictional information to review this draft.';
        [summary, details].forEach(field => field.setAttribute('aria-invalid', String(!field.value.trim())));
        (!summary.value.trim() ? summary : details).focus();
        return;
      }
      error.textContent = '';
      output.textContent = draft;
      review.hidden = false;
      review.focus();
    });
    document.querySelector('#clear-draft').addEventListener('click', () => {
      [summary, reference, details, access].forEach(field => { field.value = ''; field.removeAttribute('aria-invalid'); });
      update();
      summary.focus();
    });
    update();
    builder.hidden = false;
  }
}
