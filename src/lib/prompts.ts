export function renderTemplate(
  template: string,
  values: Record<string, string>,
): string {
  // Process conditional blocks: {{#field}}...{{/field}}
  let result = template.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, field, content) => {
      const value = values[field];
      if (!value || value.trim() === "") return "";
      // Replace placeholders inside the conditional block
      return content.replace(/\{\{(\w+)\}\}/g, (__, innerField) => {
        return values[innerField] ?? `{{${innerField}}}`;
      });
    },
  );

  // Replace remaining simple placeholders
  result = result.replace(/\{\{(\w+)\}\}/g, (match, field) => {
    return values[field] ?? match;
  });

  return result;
}
