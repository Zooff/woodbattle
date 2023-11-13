export class Vector2 {
   
    x: number
    y: number

    constructor ( x: number,  y: number) {
        this.x = x
        this.y = y
    }

    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

    public normalize() {
        const mgn = this.length()
        this.x = this.x / mgn
        this.y = this.y /mgn
    }

    divide( scalar: number) {
        this.x = this.x / scalar
        this.y = this.y / scalar
    }

}