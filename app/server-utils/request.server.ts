
export async function getFormData(request: Request, fields: string[]): Promise<{[key: string]: File | string | null}> {
  const formData = await request.formData();
  return Object.fromEntries(fields.map(field => [field, formData.get(field)]));
}