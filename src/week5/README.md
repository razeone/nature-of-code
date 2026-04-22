# Week 5 — Genetic Algorithms

*"It is not the strongest species that survives, nor the most intelligent, but the one most responsive to change."*

Genetic algorithms (GAs) are search heuristics inspired by Darwinian evolution. We use them to evolve a population of agents toward a goal — without ever telling them *how* to reach it.

---

## 5.1 Core Concepts

| Biological term | In the simulation |
|----------------|------------------|
| Organism | `Virus` agent |
| DNA / Genotype | `DNA` — array of force vectors |
| Phenotype | Actual path the virus takes |
| Environment | Canvas with target and obstacles |
| Fitness | How close / fast it reached the target |
| Natural selection | Fitter viruses are more likely to reproduce |
| Crossover | Two parent DNAs combine to make a child |
| Mutation | Random gene changes with low probability |

---

## 5.2 The DNA Class

Each `DNA` object holds an array of `p5.Vector` forces — one per tick of the simulation. A virus applies one gene per frame, following the pre-programmed force sequence:

```javascript
// Random initialisation
this.genes = Array.from({ length: lifetime }, () => {
  const v = p5.Vector.fromAngle(p.random(p.TWO_PI));
  v.mult(p.random(0, maxforce));
  return v;
});
```

No individual virus "thinks" — its entire path is determined at birth by its DNA.

---

## 5.3 Fitness Function

After each generation we calculate how well each virus performed:

```javascript
calcFitness() {
  const dist = Math.max(this.recordDist, 1);
  this.fitness = Math.pow(1 / (this.finishTime * dist), 4);

  if (this.hitObstacle) this.fitness *= 0.1;   // penalty for hitting an obstacle
  if (this.hitTarget)   this.fitness *= 2;      // bonus for reaching the target
}
```

The fitness function defines what "good" means — changing it changes what the population evolves toward.

---

## 5.4 Selection (Mating Pool)

Fitter viruses get more entries in the mating pool, making them more likely to be chosen as parents:

```javascript
// Normalise fitness to [0, 1], then add n entries proportional to fitness
const n = Math.floor(normalised * 100);
for (let j = 0; j < n; j++) this.matingPool.push(virus);
```

Picking parents randomly from this weighted pool implements **fitness-proportionate selection**.

---

## 5.5 Crossover

A child's DNA is a mix of two parents' DNA, split at a random midpoint:

```javascript
crossover(partner) {
  const mid = Math.floor(p.random(this.genes.length));
  return new DNA(p, lifetime, this.genes.map((gene, i) =>
    i > mid ? gene.copy() : partner.genes[i].copy()
  ));
}
```

This preserves blocks of "good" genes from both parents.

---

## 5.6 Mutation

Each gene has a small probability of being replaced by a random vector:

```javascript
mutate(rate) {
  this.genes = this.genes.map((gene) => {
    if (p.random(1) < rate) {
      const v = p5.Vector.fromAngle(p.random(p.TWO_PI));
      v.mult(p.random(0, maxforce));
      return v;
    }
    return gene;
  });
}
```

Mutation prevents the population from getting stuck in local optima.

---

## 5.7 The Evolutionary Cycle

```
┌─────────────────────────────────────────────┐
│  Generation n                               │
│                                             │
│  1. LIVE     — run all viruses for lifetime │
│  2. FITNESS  — score each individual        │
│  3. SELECT   — build weighted mating pool   │
│  4. REPRODUCE— crossover + mutate → Gen n+1 │
└─────────────────────────────────────────────┘
```

---

## Key Classes

| Class | Responsibility |
|-------|---------------|
| `DNA` | Stores gene array; crossover + mutate |
| `Virus` | Physics agent; applies genes; tracks fitness |
| `Population` | Manages generation lifecycle |
| `Antibiotic` | Target (pink) or obstacle (white) |

---

## Challenges

1. **Obstacle course** — Increase `OBSTACLE_COUNT` to 30. How many more generations does the population need?
2. **Mutation rate sweep** — Try rates 0.001, 0.01, 0.05, 0.2. How does mutation rate affect convergence speed and final performance?
3. **Multiple targets** — Add a second target that gives a smaller fitness bonus. Watch the population split its "strategy."
4. **Elitism** — Keep the top 10% of individuals unchanged in each generation (no crossover, no mutation). Does this speed up or slow down convergence?
