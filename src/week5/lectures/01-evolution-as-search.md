# Evolution as Search

> *"Nothing in biology makes sense except in the light of evolution."* — Theodosius Dobzhansky

## 1. The big idea
A genetic algorithm (GA) is not a simulation of biology — it is a **search procedure that borrows biology's playbook**. We keep a *population* of candidate solutions, score them with a *fitness function*, and let the better ones bias the next generation through *selection*, *crossover*, and *mutation*. Over many cycles, the population drifts toward regions of the search space where fitness is high — without us ever telling it *how* to get there.

## 2. Where this comes from
Charles Darwin's 1859 *On the Origin of Species* described natural selection as a non-teleological optimizer: heritable variation plus differential reproduction will, given time, produce organisms exquisitely fit to their niche. He had no theory of inheritance. Gregor Mendel supplied that piece in the 1860s with discrete units of heredity, but it took until the 1930s "modern synthesis" to fuse Mendelian genetics with Darwinian selection into the framework we now teach.

In computing, John Holland's group at the University of Michigan reframed this as an algorithm. *Adaptation in Natural and Artificial Systems* (1975) defined the canonical genetic algorithm: bit-string genotypes, a fitness function, fitness-proportionate selection, single-point crossover, and per-bit mutation. David Goldberg's 1989 textbook then carried the technique into mainstream engineering — control systems, pipeline routing, scheduling.

The artistic lineage is just as important. Richard Dawkins' "Biomorphs" in *The Blind Watchmaker* (1986) let a human play the role of the fitness function, clicking on the most appealing offspring to drive evolution. Karl Sims' SIGGRAPH '94 *Evolving Virtual Creatures* extended the same idea to 3D body plans and locomotion controllers — a watershed moment that proved evolved artifacts could be both surprising and beautiful.

For Daniel Shiffman's *Nature of Code* (Chapter 9), GAs are interesting precisely because they decouple *behavior* from *intent*. We do not write the rules of how to reach the target; we write the rules of how to *score* attempts. The agents discover the rest.

## 3. The model
A GA needs four ingredients: an **encoding** (how a candidate solution looks as a "genome"), a **fitness function** (a scalar score), a **selection rule** (how parents are picked), and **variation operators** (crossover and mutation). The whole loop is:

```
initialise population P0
repeat for each generation g:
    evaluate fitness f(x) for x in Pg
    parents <- select from Pg weighted by f
    children <- crossover(parents) then mutate
    Pg+1 <- children
```

The genome can be bits, real numbers, trees, or — as in our sketch — an ordered list of force vectors. The fitness function turns a phenotype (the *behavior* the genome produces when "run") into a single number. Crossover lets useful sub-structures recombine; mutation supplies novelty so the population can escape local optima. The whole thing is a stochastic hill-climber with a *parallel* population, which gives it a much better shot at navigating rugged landscapes than a single agent doing local search.

The deep promise of this approach is generality. The *same* algorithm can evolve antenna shapes, neural-network weights, and trajectories on a 2D canvas. Only the encoding and fitness change.

## 4. In our code
The Week 5 sketch evolves a population of viruses to navigate from the bottom of the canvas to a target antibiotic at the top, threading through random obstacles.

The genome is an ordered array of force vectors — one per simulation tick — built at random for the founding generation:

```javascript
this.genes = Array.from({ length: lifetime }, () => {
  const v = p5.Vector.fromAngle(p.random(p.TWO_PI));
  v.mult(p.random(0, this.maxforce));
  return v;
});
```
*— `src/week5/DNA.js:24-28` (`constructor`)*

The phenotype is the *path* the virus traces when it consumes one gene per tick:

```javascript
if (!this.hitObstacle && !this.hitTarget) {
  this.applyForce(this.dna.genes[this.geneCounter % this.dna.genes.length]);
  this.geneCounter++;
  this.update();
  this.#checkObstacles(obstacles);
}
```
*— `src/week5/Virus.js:53-58` (`run`)*

The fitness function rewards getting close fast and punishes hitting obstacles:

```javascript
calcFitness() {
  const dist = Math.max(this.recordDist, 1);
  this.fitness = Math.pow(1 / (this.finishTime * dist), 4);
  if (this.hitObstacle) this.fitness *= 0.1;
  if (this.hitTarget)   this.fitness *= 2;
}
```
*— `src/week5/Virus.js:39-44` (`calcFitness`)*

Notice we never tell the virus *which way* to go. We only define what "good" means.

## 5. Try it

<details><summary>Hint — Why the fourth power?</summary>
The `Math.pow(..., 4)` exaggerates differences between high- and low-fitness viruses, which biases selection more aggressively. Try changing the exponent to 1, 2, and 8 and watch how convergence speed changes.
</details>

<details><summary>Hint — A different fitness</summary>
What if you only rewarded reaching the target (boolean fitness)? You'd get almost no selection pressure in early generations because no one reaches it. Smooth fitness landscapes are crucial for GAs.
</details>

<details><summary>Hint — Interactive evolution</summary>
Replace `calcFitness()` with a UI that lets you click on the virus you "like best" each generation. Congratulations, you've built Dawkins' Biomorphs.
</details>

## 6. Going further
- Holland, John H. (1975). *Adaptation in Natural and Artificial Systems*. University of Michigan Press.
- Mitchell, Melanie (1996). *An Introduction to Genetic Algorithms*. MIT Press.
- Dawkins, Richard (1986). *The Blind Watchmaker* — "Biomorphs" chapter.
- Sims, Karl (1994). "Evolving Virtual Creatures". SIGGRAPH. https://www.karlsims.com/papers/siggraph94.pdf
- Shiffman, Daniel. *The Nature of Code* (2024). Chapter 9. https://natureofcode.com/
- The Coding Train — Genetic Algorithms playlist. https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/1-introduction
