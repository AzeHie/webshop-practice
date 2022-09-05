export class OrderDetails {
  public customerDetails: any;
  public products: any[];
  public shippingMethod: string;
  public paymentMethod: string;

  constructor(
    customerDetails: any,
    products: any[],
    shippingMethod: string,
    paymentMethod: string
  ) {
    this.customerDetails = customerDetails;
    this.products = products;
    this.shippingMethod = shippingMethod;
    this.paymentMethod = paymentMethod;
  }
}
