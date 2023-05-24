export class Ingredient {
  /* public name: string;
  public amount: number;

  constructor(name, amount) {
    this.name = name;
    this.amount = amount;
  } */

  //The following is a shortcut syntax that serves the same purpose
  constructor(public name: string, public amount: number) {}
}