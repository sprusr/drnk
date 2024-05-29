const bestPerformingOnTap = async () => {
  const response = await fetch('https://bar.emf.camp/api/on-tap.json');
  const data = await response.json();
  const best = (stockitems) => stockitems.reduce((acc, stockitem) => {
    const thisPerformance = parseFloat(stockitem.stocktype.price) / parseFloat(stockitem.stocktype.abv);
    return thisPerformance < acc.performance || acc.performance === null
      ? { performance: thisPerformance, result: stockitem.stocktype.fullname }
      : acc;
  }, { result: null, performance: null })
  const { result: ale } = best(data.ales);
  const { result: keg } = best(data.kegs);
  const { result: cider } = best(data.ciders);
  return { ale, keg, cider };
}

export async function onRequest(context) {
  const { ale, keg, cider } = await bestPerformingOnTap();
  return new Response.json([{
    "verb": "say",
    "text": `Here are the best price performance drinks currently on tap. Ale is: ${ale ?? 'unknown'}. Keg is: ${keg ?? 'unknown'}. Cider is ${cider ?? 'unknown'}. Cheers!`
  },
  {
    "verb": "hangup"
  }]);
}
