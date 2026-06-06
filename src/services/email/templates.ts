export function emailLayout(
  title: string,
  content: string
) {
  return `
    <div
      style="
        max-width:600px;
        margin:auto;
        padding:20px;
        font-family:Arial,sans-serif;
      "
    >
      <h1>
        ${title}
      </h1>

      <div>
        ${content}
      </div>

      <hr />

      <p>
        Portify AI
      </p>
    </div>
  `;
}