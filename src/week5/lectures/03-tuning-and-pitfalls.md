# Tuning and Pitfalls

> *"All models are wrong, but some are useful."* — George E. P. Box

## 1. The big idea
A genetic algorithm has only a handful of knobs — population size, mutation rate, selection pressure, fitness shape — but those knobs interact in non-obvious ways. Get them wrong and your population either flat-lines (no progress) or stampedes into a single mediocre solution and stays there forever (premature convergence). This lecture is about reading those failure modes and turning the right dial.

## 2. Where this comes from
Holland's 1975 *schema theorem* gave the first formal answer to "why does this work at all?". A *schema* is a template like `1*0**1` that matches many genomes. Holland showed that under fitness-proportionate selection, single-point crossover, and low mutation, schemata of *short* defining length and *above-average* fitness receive an *exponentially* growing number of trials in successive generations. In other words, GAs implicitly process huge numbers of overlapping building blocks in parallel — Goldberg later popularised this as **implicit parallelism**.

Almost every practical GA tuning rule traces back to that result. *Mutation must be low* because a high rate destroys schemata faster than selection can amplify them. *Population must be big enough* to host a diverse pool of building blocks, but not so big that runtime explodes. *Crossover and selection should preserve good blocks*, which is why low-disruption operators (single-point) often beat aggressive ones (uniform) on building-block problems.

The opposite failure mode — **premature convergence** — was first studied empirically by De Jong (1975) on his famous test-function suite. He observed that without intervention, fitness-proportionate selection lets early "lucky" individuals dominate the mating pool, the population's diversity collapses, and search gets stuck in a local optimum. The community responded with three classes of fix: scaling (rank or sigma scaling instead of raw fitness), niching (penalise individuals that are too similar), and **elitism** (always carry the best individual unmodified into the next generation).

Modern practitioners also worry about the **fitness landscape** itself. If the function is mostly flat with a single sharp peak (a "needle in a haystack"), no GA will help — there are no gradients to climb. GAs shine on landscapes that are *rugged but correlated*: many peaks, but locally informative. Diagnosing this is half the battle.

## 3. The model
Three quantitative rules of thumb that survive in textbook form:

```
mutation_rate ≈ 1 / genome_length          (one expected mutation per child)
population    ≈ 50 .. several hundred       (problem-dependent)
selection_pressure: keep the ratio max(f)/avg(f) bounded
```

The first comes from minimising disruption while still injecting novelty. The second is the empirical sweet spot from decades of benchmarks; below ~30 you lose diversity, above ~500 you mostly burn cycles. The third is what scaling and tournament selection enforce — if `max(f)/avg(f)` blows up, the best individual swamps the mating pool and diversity collapses in a few generations.

The schema theorem in compact form:

```
m(H, t+1) ≥ m(H, t) · f(H)/f̄ · (1 - p_c · δ(H)/(L-1)) · (1 - p_m)^o(H)
```

`m(H,t)` is the number of individuals matching schema `H` at time `t`, `f(H)/f̄` is its fitness ratio, `δ(H)` its defining length, `o(H)` its order, `p_c` and `p_m` are crossover and mutation probabilities. Don't memorise it — just notice the *direction* of each term: high relative fitness helps, long schemata are fragile under crossover, high-order schemata are fragile under mutation.

**Elitism** modifies the cycle so the top-`k` individuals are copied unchanged into the next generation before crossover and mutation produce the rest. It guarantees fitness is monotonically non-decreasing across generations, at the cost of slightly accelerated convergence (and therefore a slightly higher risk of getting stuck).

## 4. In our code

The Week 5 sketch picks small, conservative defaults that you can — and should — change:

```javascript
const MUTATION_RATE  = 0.01;
const POP_SIZE       = 50;
const OBSTACLE_COUNT = 12;
```
*— `src/week5/sketch.js:15-17`*

A 1% mutation rate means roughly one gene in every two children of a 100-gene genome is replaced — well-aligned with the `1/L` rule of thumb (our `lifetime = p.height = 600`, so the effective rate per child is ~6 mutations per genome). Try `0.001` and `0.1` to feel the extremes.

The integer-bucket roulette amplifies fitness differences by a factor of 100, which means a virus with `normalised fitness = 1.0` gets 100 mating-pool entries while one with `0.01` gets exactly 1. That ratio *is* our selection pressure:

```javascript
const normalised = this.p.map(v.getFitness(), 0, maxFit, 0, 1);
const entries    = Math.floor(normalised * 100);
for (let j = 0; j < entries; j++) this.matingPool.push(v);
```
*— `src/week5/Population.js:52-54` (`selection`)*

Watch what happens when one virus dominates: nearly the entire mating pool is copies of it, two parents picked at random are very likely to be the same individual, crossover becomes a no-op, and only mutation keeps the population from collapsing into clones. **That is premature convergence in slow motion.** A symptom in our sketch is generations 30+ where every virus follows almost the same path through the obstacles.

The fitness function itself is the most important tuning surface. The fourth-power exponent makes the landscape *very* sharp near the optimum, which speeds up late-stage convergence but can also hide the gradient when no virus is close yet:

```javascript
this.fitness = Math.pow(1 / (this.finishTime * dist), 4);
if (this.hitObstacle) this.fitness *= 0.1;
if (this.hitTarget)   this.fitness *= 2;
```
*— `src/week5/Virus.js:41-43` (`calcFitness`)*

The 0.1 obstacle penalty keeps obstacle-hitters in the gene pool — they still reproduce, just less. A penalty of `0` would erase them entirely; you'd find the early generations almost extinct. This is a **soft constraint**, and soft is almost always better than hard for GAs because it keeps the gradient alive.

There is no elitism in our code. The best virus of generation `n` may not survive to generation `n+1` — both because it might not be picked as a parent, and because if it is, crossover and mutation will alter its child. To add elitism, you would copy the top-`k` viruses' DNA verbatim into the next generation before running the existing `reproduction()` loop on the remaining `POP_SIZE - k` slots. Try `k = 5` (10% elitism) and watch the best-fitness curve become monotone.

## 5. Try it

<details><summary>Hint — Mutation-rate sweep</summary>
Run the sketch four times with `MUTATION_RATE` in `{0.001, 0.01, 0.05, 0.2}`. Log the generation at which a virus first reaches the target. Very low rates plateau; very high rates never settle.
</details>

<details><summary>Hint — Spot premature convergence</summary>
Add `console.log(population.matingPool.length)` after `selection()`. If it shrinks dramatically across generations, your selection pressure is too aggressive — diversity is dying.
</details>

<details><summary>Hint — Implement elitism</summary>
In `reproduction()`, sort the current `population` by fitness, slice the top 5, push their DNA (cloned) into the new array first, then `map` the remaining `size - 5` slots as before. Compare best-fitness over time with and without.
</details>

## 6. Going further
- Holland, John H. (1975). *Adaptation in Natural and Artificial Systems* — schema theorem.
- De Jong, Kenneth A. (1975). *An Analysis of the Behavior of a Class of Genetic Adaptive Systems*. PhD thesis, U. Michigan.
- Goldberg, David E. (1989). *Genetic Algorithms in Search, Optimization, and Machine Learning* — implicit parallelism, scaling, elitism.
- Mitchell, Melanie (1996). *An Introduction to Genetic Algorithms* — chapters 4–5 on theory and pitfalls.
- Shiffman, Daniel. *The Nature of Code* (2024). Chapter 9. https://natureofcode.com/
- The Coding Train — Genetic Algorithms playlist. https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/9-genetic-algorithms/1-introduction
