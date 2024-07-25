document.getElementById ("item5").innerHTML =
String.raw
`
<div class=card-header >
<h5>Linear Regression - MLE </h5></div>
<div class="card-body">
<p class=card-text>
Assume that we have a set of measurements of $y_i$ corresponding to $x_i$,
and the measurement is not deterministic. That is $y$ values are not 
uniquely determined for any given x but have a distribution. And we will assume this
distribution correspond to a normal distribution with the following parameters.

\begin{align*}
P(y_i | \mu_i, \sigma) = \NDist{y_i}{\mu_i}{\sigma}    i = 1 .. M \\
   \textit{where }   \mu_i =  \sum_{k=1}^N w_k  \phi_k(x_i)
\end{align*}

Note the functions $\phi_k(x)$ are specified and can by arbitraily non-linear
in $x$. The linear regression description in the analysis is in relation to the
coefficients $w_k$.

One way to determining the unknown wieghts $w_k$ and $\sigma$ in the proposed
distribution, based on the observed data $(x_i, y_1)$ points, is to maximise
the likelihood function. That is we express the likelihood of observing the
data based on above assmed distribution form for a specified parameter set.
And we seek these parameters that maximise this likelihood.

For illustration purpose, we will assume $\phi_k(x) = x^{k-1}$. Then
$\mu_i$ is a polynomial function of $x_i$ of degree $N-1$.
The likelihood of observing (x_i,y_i i=1..M) assuming above distribution for
random variables $y_i$ is given as follows.

\[
\begin{align*}
L(\yv | \boldsymbol{\mu}, \sigma) = \prod_{i=1}^{M}  \NDist{y_i}{\mu_i}{\sigma} \\
\textit{where }   \mu_i =  \sum_{k=1}^N w_k  x_i^{k-1}
\end{align*}
\]

Maximising the above function with respect to parameters $\wv , \sigma$
will yield the distribution of random variable with assumed functional dependance
on x. Noting that maximisation of above likelihood  is equivalent to maximising the
logarithem of the likelihood, the parameters of interest can be evaluated as follows.

\[
\left.\begin{align*}
\frac{\partial L}{\partial w_j} = 0 \\
\therefore \sum_{i=1}^{M} \left( y_i - \sum_{k=1}^{N} w_k x_i^{k-1} \right) x_i^{j-1} = 0
\end{align*}\right\} j=1..N
\]

\[
\begin{align*}
\frac{\partial L}{\partial \sigma} = 0 \\
\therefore \sum_{i=1}^{M} \left\{ (y_i - \mu_i)^2 - \sigma^2 \right\}    = 0 \\
\sigma =  \sqrt{ \frac{\sum_{i=1}^{M} (y_i - \mu_i)^2}{M}}  
\end{align*}
\]

Coefficient vector $\wv$ can determined as follows.

\[
\begin{align*}
\wv  &= \left(\Xv \Xv^T \right)^{-1} \Xv \yv \\
\textit{where } \Xv & = 
\begin{pmatrix}
     x_1^0 & x_1^1 & x_1^2 & x_1^3 & .. & x_1^N \\
     x_2^0 & x_2^1 & x_2^2 & x_2^3 & .. & x_2^N \\
     x_3^0 & x_3^1 & x_3^2 & x_3^3 & .. & x_3^N \\
     .. & ..  \\
     x_M^0 & x_M^1 & x_M^2 & x_M^3 & .. & x_M^N \\
\end{pmatrix} \\
\wv &= [w_1 \  w_2 \ .. \ w_N]^T \\
\yv &= [y_1 \ y_2 \ .. \ y_M]^T
\end{align*}
\]

The following figure illustrates the way above Maximum
Likelihood based regression (MLE) estimate works. A third degree
polynomial with coefficients $[1,2,3,4]$ was used to generate
data with random noise corresponding to standar deviation of 0.5
with the mean at $\mu_i$. This data is subsequently used to
test how MLE estimates the weight coefficient vector along with
the standard deviation. 
	<figure class=figure  id="fig3"></figure>
</p>	

</div>
`

