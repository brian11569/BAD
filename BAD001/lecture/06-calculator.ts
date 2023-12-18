export interface Calculator {
    getValue(): number
    add(amount: number): void
    minus(amount: number): void
  }
  
  export class BasicCalculator implements Calculator {
    private value = 0
    getValue(): number {
      return this.value
    }
    add(amount: number): void {
      this.value += amount
      this.roundToNearestTenCent()
    }
    minus(amount: number): void {
      this.value -= amount
      this.roundToNearestTenCent()
    }
    roundToNearestTenCent(): void {
      this.value = Math.round(this.value * 10) / 10
    }
  }