export class searchLogic {
  public static hasValidQuery(query: string): boolean {
    return query.length === 0 || query.length >= 3;
  }

  public static filterFromQuery<ItemT>(
    items: ItemT[],
    query: string,
    propNames: string[]
  ): ItemT[] {
    if (!searchLogic.hasValidQuery(query)) {
      return items;
    }

    query = query.trim();

    return items.filter((item) => {
      const searchPropNames = Object.keys(item as any).filter(
        (pn) => propNames.indexOf(pn) >= 0
      );
      const propValues = searchPropNames.map((pn) => (item as any)[pn]);

      return (
        propValues.filter((pv) => (pv.toString() as string).includes(query))
          .length > 0
      );
    });
  }
}