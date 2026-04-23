# The Genetic Cycle

> *"Survival of the fittest is not survival of the strongest; it is survival of the most reproductively successful."*

## 1. The big idea
One generation of a GA is a four-stroke engine: **live, score, select, reproduce**. Each stroke maps to a method on `Population`, and the cycle repeats forever. Once you have those four methods working in any encoding, you have a genetic algorithm — every other technique (elitism, tournament selection, niching) is a refinement of one of these strokes.

## 2. Where this comes from
The four-step decomposition appears verbatim in Holland's 1975 monograph and was canonised in Goldberg's 1989 textbook. It mirrors what biologists call a *generation interval*: organisms develop, are tested by their environment, mate, and produce offspring. The mathematical analysis of *why* this works is the **schema theorem**, which we'll meet in lecture 03.

Fitness-proportionate selection — the specific mechanism we use — was Holland's original choice. The folk name is the **roulette wheel**: imagine each individual occupies a slice of a wheel proportional to its fitness, then spin the wheel to pick a parent. Higher-fitness individuals get bigger slices, but everyone has *some* chance, which preserves diversity.

Single-point crossover was also Holland's original. It was inspired by the way real chromosomes break and rejoin during meiosis, but as a search operator its role is more abstract: it lets two parents recombine *blocks* of co-adapted genes. Many other crossover operators exist — uniform, two-point, arithmetic — but single-point is the cleanest pedagogical case.

Mutation arrived last in the canonical formulation. Holland actually downplayed it, treating it as background noise. Later researchers (notably the evolution-strategies school in Germany) argued mutation was the primary creative force. In practice, both crossover and mutation matter, and the relative emphasis is a tuning decision.

## 3. The model
Let `P` be the population, `f(x)` the fitness function, `Cross(a,b)` crossover, and `Mut(c, r)` per-gene mutation with rate `r`. The cycle is:

```
1. LIVE      — for each x in P, run x's phenotype to completion
2. FITNESS   — compute f(x) for every x
3. SELECT    — build mating pool M where Pr(x in M) ∝ f(x)
4. REPRODUCE — for i in 1..|P|:
                   a, b ← random picks from M
                   c    ← Cross(a, b)
                   Mut(c, r)
                   put c in P'
              P ← P'
```

Two subtle but important choices: (a) selection is *with replacement*, so a very fit individual can be chosen as both parents — and that's fine, GAs do not enforce outbreeding; (b) reproduction creates exactly `|P|` children, so population size is constant. Variations exist (steady-state GAs, generational replacement with elitism), but constant-size generational replacement is the default.

The fitness-to-mating-pool conversion is where most beginner GAs go wrong. Our implementation uses an *integer-bucket roulette*: each individual contributes `floor(normalisedFitness * 100)` entries to a flat array. Picking a parent is then just a uniform random index. This is O(N) memory but O(1) per pick, and easy to read.

## 4. In our code

**LIVE.** Every virus advances one tick using its next gene. The whole population is just a `for` loop over individuals:

```javascript
live(obstacles, target) {
  for (const v of this.population) {
    v.checkTarget(target);
    v.run(obstacles, target);
  }
}
```
*— `src/week5/Population.js:34-39` (`live`)*

**FITNESS.** Each virus scores itself based on what it observed during its life:

```javascript
fitness() {
  for (const v of this.population) v.calcFitness();
}
```
*— `src/week5/Population.js:42-44` (`fitness`)*

**SELECT.** We normalise fitness against the population maximum, then push each individual into the mating pool that many "tickets":

```javascript
selection() {
  this.matingPool = [];
  const maxFit = this.#getMaxFitness();

  for (const v of this.population) {
    const normalised = this.p.map(v.getFitness(), 0, maxFit, 0, 1);
    const entries    = Math.floor(normalised * 100);
    for (let j = 0; j < entries; j++) this.matingPool.push(v);
  }
}
```
*— `src/week5/Population.js:47-56` (`selection`)*

**REPRODUCE.** We draw two parents uniformly from the mating pool, cross their DNA, mutate, and place the child at the start position. This produces exactly `population.length` new viruses:

```javascript
this.population = this.population.map(() => {
  const mom = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
  const dad = this.matingPool[Math.floor(this.p.random(this.matingPool.length))];
  const childDNA = mom.getDNA().crossover(dad.getDNA());
  childDNA.mutate(this.mutationRate);
  return new Virus(this.p, start, childDNA, this.lifetime);
});
```
*— `src/week5/Population.js:62-68` (`reproduction`)*

The crossover operator is single-point, with the split chosen uniformly along the genome:

```javascript
crossover(partner) {
  const midpoint = Math.floor(this.p.random(this.genes.length));
  const childGenes = this.genes.map((gene, i) =>
    i > midpoint ? gene.copy() : partner.genes[i].copy()
  );
  return new DNA(this.p, this.lifetime, childGenes);
}
```
*— `src/week5/DNA.js:38-44` (`crossover`)*

Mutation walks each gene independently and replaces it with a fresh random vector with probability `rate`:

```javascript
mutate(rate) {
  this.genes = this.genes.map((gene) => {
    if (this.p.random(1) < rate) {
      const v = p5.Vector.fromAngle(this.p.random(this.p.TWO_PI));
      v.mult(this.p.random(0, this.maxforce));
      return v;
    }
    return gene;
  });
}
```
*— `src/week5/DNA.js:50-59` (`mutate`)*

The driving sketch wires these four steps into the frame loop. While `lifeCounter < lifetime` we are in the LIVE phase; otherwise we trigger one full generation transition:

```javascript
if (lifeCounter < lifetime) {
  population.live(obstacles, target);
  lifeCounter++;
} else {
  // Next generation
  lifeCounter = 0;
  population.fitness();
  population.selection();
  population.reproduction();
}
```
*— `src/week5/sketch.js:55-64* (`p.draw`)*

## 5. Try it

<details><summary>Hint — Replace single-point with uniform crossover</summary>
For each gene index, flip a coin and take that gene from mom or dad. This breaks up "blocks" more aggressively. Compare convergence speed against single-point.
</details>

<details><summary>Hint — Tournament selection</summary>
Replace the mating-pool roulette with: pick `k=3` random individuals, return the fittest. This is cheaper (no normalisation, no big array) and works well even when fitness values span many orders of magnitude.
</details>

<details><summary>Hint — Why `floor(normalised * 100)`?</summary>
The `100` controls how aggressively fitness translates into pool entries. Try `1000`. Try `10`. The smaller the multiplier, the noisier (more "fair") selection becomes; the larger, the more elitist.
</details>

## 6. Going further
- Holland, John H. (1975). *Adaptation in Natural and Artificial Systems*. University of Michigan Press.
- Goldberg, David E. (1989). *Genetic Algorithms in Search, Optimization, and Machine Learning*. Addison-Wesley.
- Mitchell, Melanie (1996). *An Introduction to Genetic Algorithms*. MIT Press.
- Shiffman, Daniel. *The Nature of Code* (2024). Chapter 9. https://natureofcode.com/
- The Coding Train — Genetic Algorithms playlist. https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/1-introduction
- p5.js Reference — `p5.Vector`. https://p5js.org/reference/#/p5.Vector
