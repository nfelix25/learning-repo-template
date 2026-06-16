type NumberMethod<This, Args extends unknown[]> = (
  this: This,
  ...args: Args
) => number;

export function createAccountSolution() {
  function nonNegative<This, Args extends unknown[]>(
    original: NumberMethod<This, Args>,
    context: ClassMethodDecoratorContext<This, NumberMethod<This, Args>>
  ): NumberMethod<This, Args> {
    return function replacement(this: This, ...args: Args): number {
      const result = original.call(this, ...args);

      if (result < 0) {
        throw new RangeError(`${String(context.name)} returned a negative value`);
      }

      return result;
    };
  }

  class Account {
    balance = 10;

    @nonNegative
    remainingAfterWithdrawal(amount: number): number {
      return this.balance - amount;
    }
  }

  return new Account();
}
