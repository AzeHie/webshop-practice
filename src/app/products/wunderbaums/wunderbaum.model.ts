export class Wunderbaum {
  public productId: string;
  public title: string;
  public imagePath: string;
  public description: string;
  public price: string;

  constructor(
    id: string,
    title: string,
    imagePath: string,
    description: string,
    price: string
  ) {
    this.productId = id;
    this.title = title;
    this.imagePath = imagePath;
    this.description = description;
    this.price = price;
  }
}
