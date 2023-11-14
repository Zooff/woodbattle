import { GameObject } from "./game-object.interface"
import { Vector2 } from "./vector2"

export class QuadTree<T extends {position: Vector2, width: number, height: number}> {

    maxDepth: number

    maxObjects: number

    objects: T[] | null = []

    level: number

    boundary: Boundary

    nodes: QuadTree<T>[] | null = null


    constructor(boundary: Boundary, maxDepth: number, maxObjects: number, level?: number) {
        this.maxDepth = maxDepth ?? 4
        this.maxObjects = maxObjects ?? 10
        this.level = level ?? 0
        this.boundary = boundary

    }

    insert(object: T) {

        console.log(object)

        if (!this.boundary.overlaps(new Boundary (object.position.x, object.position.y, object.width, object.height))) {
            return
        }

        if (this.nodes && this.nodes.length) {
            for (const node of this.nodes) {
                node.insert(object)
            }

            return
        }


        if (this.objects && this.objects.length === this.maxObjects && this.level < this.maxDepth) {
            this.subdivide()
            for (const node of this.nodes!) {
                node.insert(object)
            }

        }
        else {
            if (!this.objects) this.objects = []
            this.objects.push(object)
        }


    }

    subdivide() {
        const level = this.level + 1
        const width = this.boundary.width / 2
        const height = this.boundary.height / 2
        const x = this.boundary.x
        const y = this.boundary.y

        this.nodes = []
        this.nodes.push(new QuadTree<T>(new Boundary(x, y, width, height), this.maxDepth, this.maxObjects, level))
        this.nodes.push(new QuadTree<T>(new Boundary(x + width, y, width, height), this.maxDepth, this.maxObjects, level))
        this.nodes.push(new QuadTree<T>(new Boundary(x + width, y + height, width, height), this.maxDepth, this.maxObjects, level))
        this.nodes.push(new QuadTree<T>(new Boundary(x, y + height, width, height), this.maxDepth, this.maxObjects, level))

        if (this.objects) {
            while (this.objects.length > 0) {
                const object = this.objects.pop()

                for (const node of this.nodes) {
                    if (object) {
                        node.insert(object)
                    }
                }

            }
        }

        this.objects = null
    }

    retrieve(area: Boundary): T[] {

        let res: T[] = []

        if (!this.boundary.overlaps(area)) {
            return []
        }

        if (this.nodes && this.nodes.length) {
            for (const node of this.nodes) {
                res = res.concat(node.retrieve(area))
            }
        }
        else {
            if (this.objects) res = this.objects
            else res = []
        }

        if (this.level === 0) {
            return Array.from(new Set(res))
        }

        return res
    }
}

export class Boundary {

    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) { }


    public contains(x: number, y: number) {

        return (
            x > this.x 
            && x < this.x + this.width
            && y > this.y
            && y < this.y + this.height
        )
    }

    overlaps (aabb: Boundary): boolean {
        return !(
             aabb.x - aabb.width > this.x + this.width
          || aabb.x + aabb.width < this.x - this.width
          || aabb.y - aabb.height > this.y + this.height
          || aabb.y + aabb.height < this.y - this.height
        )
      }
}