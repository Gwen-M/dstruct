export async function loadData() {
  const get = async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path} (${response.status})`);
    return response.json();
  };
  const [sources, common, ...cases] = await Promise.all([
    get('/data/sources.json'), get('/data/common.json'),
    ...['01-solo-consultant','02-venture-team','03-ecommerce','04-cofounders','05-relocation'].map(id => get(`/data/cases/${id}.json`))
  ]);
  return {sources, common, cases};
}
