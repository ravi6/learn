// A clever way to breakup large chunks of html
// pages String.raw ... good for protecting backslashes
document.getElementById ("item1").innerHTML =
String.raw
`
  <div class=card-header ><h5>
    Bayesian Estimation of Discrete Distribution </h5>
  </div>
<div class="card-body">
<p class="card-text">
  Let us consider a large batch of balls with three
  possible colors. By sampling from this batch we want
  to estimate the color distribution of the batch based on 
  the samples we analyse. Here is the way we can implement
  a Bayesian estimation of distribution with incremental
  sampling from the batch.

  The discrete distribution of the coloured balls in the batch 
  can be represented as 
    </p>
<div class="border border-info rounded bg-light bg-gradient">
\[
\begin{align}
C_1 \hspace{10mm} & a \nonumber \\
C_2 \hspace{10mm} & b \nonumber \\
C_3 \hspace{10mm} & 1 - a - b \nonumber \\
\end{align}
\]
</div>
<p class="card-text">
$a$ and $b$ represent probabilities associated with picking
$C_1$ and $C_2$ coloured balls respectively and they represent the
respective fractions the batch.
</p>
<p class="card-text">
In this example of Baesian estimation strategy the above 
unknown parameters ($a$ and $b$) are assumed to be distributed
with some arbitray discrete distribution function f(a, b)
in the following manner. (Note: in reality a and b are continuous
variables and the combined distribution is complicated due to additional contraint
$(a+b) \le 0$. Would this be approximated by a product of two beta 
functions with four parameters??. Need to examine it later)
) 
</p>
<div class="border border-info rounded bg-light bg-gradient">
$$
\begin{aligned}
P(a(i), b(i)) & = p(i)  \quad \quad   i = 1 .. 11  \\
& a(i) \in \{0, 0.1, 0.2, ... 1\} \\
& b(i) \in \{1-a(i), 1-a(i)+0.1, .. 1\} 
\end{aligned}
$$
</div>
<p class="card-text">
Now with a given sample of N balls containing  $n_1, n_2, n_3$ coloured
balls the likelihood of this sample is from above distribution is given
by the following.
</p>
<div class="border border-info rounded bg-light bg-gradient">
$$
\begin{aligned}
\textit{Likelihood} &  \quad L(sample \quad | \quad  (a_i, b_i))  \\ 
& \propto    \{a(i)\}^{n_1}
                     \{b(i)\}^{n_2}
		     \{1 - a(i) - b(i)\}^{n_3}  \quad
		       i = 1 .. 11
\end{aligned}
$$
</div>
<p class="card-text">
The above likelihood value is weighted with the prior probability
$\left(P(a(i),b(i)\right)$ to obtain posterior probability. 
</p>
<div class="border border-info rounded bg-light bg-gradient">
$$
\begin{aligned}
P^{post} (a(i),b(i))  \propto  L * P(a(i),b(i)) \\ 
\therefore P^{post} (a(i),b(i)) =   \frac{ L * P(a(i),b(i)) } 
{ \sum_{i=1}^{11} L * P(a(i),b(i)) } 

\end{aligned}
$$
</div>
<p class="card-text">
Whenever a new sample data is obtained the process can be repeated 
with posterior estimate of the past as a prior. Since each sample outcome
is independant one would expect, with enough batches of samples the 
posterior would converge to the orginal batch distribution.
</p>
<p class="card-text">
The following figure shows some simulation results to illustrate the point.
Random samples from a batch of coloured balls with known proportions (0.3, 0.5, 0.2)
are drawn and starting with a uniform prior, the posterior estimated 
with three batches of 100 samples. The resulting changes in posterior estimate
can be seen in the graph.
</p>
<figure class=figure  id="fig1"></figure>
</div>
` ;
