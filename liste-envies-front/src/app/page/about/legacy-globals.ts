// Les anciens scripts (smartslider) utilisent des variables globales implicites,
// interdites en mode strict (ESM). On les déclare avant leur chargement.
const w = window as any;
w.c1 = w.c2 = w.c3 = 0;
export {};
