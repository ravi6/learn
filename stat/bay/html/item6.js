document.getElementById ("item6").innerHTML =
String.raw
`
<div class=card-header >
<h5> Linear Regression - MAP  </h5>
</div>
 <div class="card-body">

In the MLE method of linear regression described earlier, the model parameters
$w_k$ have no uncertainity associated with them and can lead to 
overfitting the data, especially when sample size is not sufficiently large.

One way to address this issue is to ascribe some distribution to
the parameters $w_k$ thus treating them as random variables.
This distribution is of course is yet to be
determined from the observed data. This is where Bayesian approach 
comes to rescue. One could start with a prior distribution ascribed
to each $w_k$ and then update the prior based on the new observations.
Since all observations are assumed to be independant, one would expect 
posterior estimate to converge to true distribution as more observations
are made.

The parameters associated with the distributions for all $w_k$,
are obtained based on maximum likelihood estimate similar to MLE. 
The likelihood estimate however is
now weighted with prior probabilities.

Although it is not essential, for illustration purpose, we would
assume that all parameters $w_k$ are normally distributed 
$\mathcal{N}(0, \sigma_w) $with zero mean and $\sigma_w$ standard deviation.
\[
\begin{align*}
p(w_j) = \NDist{w_j}{0}{\sigma_w}  j = 1..N
\end{align*}
\]

The the probability that  parameters are $\wv$ given the
data $(\xv, \yv), \sigma, \sigma_w$ can now be written as follows.

\[
\begin{align*}
p (\wv | \xv, \yv, \sigma, \sigma_w) \propto
  \prod_{k=1}^{M} \NDist{y_k}{\phi(x_k, \wv)}{\sigma}     
  \prod_{i=1}^{N} \NDist{w_i}{0}{\sigma_w}     \\
\end{align*}
\]

Once again, we seek to maximize the above probability with
respect to $\wv$. Essentially, we have now introduced
one additional degree of freedom $\sigma_w$ allowing some variability
in the estimated parameters $\wv$, with the constraint that mean of
each $w_k$ is zero. 

It is worth re-iterating that such a construct is still a type of model
that we arbitrarily chose to fit the data. In statistical jargon, this
introduction of additional degree of freedom along with some
constraint is termed as "regularization"

The log of the above function can now be written as follows
\[
\begin{align*}
\psi(\sigma, \sigma_w, \wv) =
 - \sum_{i=1}^{M}   \frac{1}{2} ln(2\pi\sigma^2)
                 + \frac{(y_i - \phi(x_i,\wv))^2}{2\sigma^2} \\
 -\sum_{k=1}^{N} \frac{1}{2} ln(2\pi\sigma_w^2) 
                 + \frac{1}{2} \left( \frac{w_k}{\sigma_w} \right)^2 \\
		 \textrm{where }   \phi(x_i,\wv) =  \sum_{k=1}^N w_k  x_i^{k-1}
\end{align*}
\]

Now we can determine the values of  $\xv$ that maximize
the above quantity.

\[
\left.\begin{align*}
\frac{\partial \psi}{\partial w_j} = 0 \\
\therefore 
    \sum_{i=1}^{M} \left( 
         y_i - \sum_{k=1}^{N} w_k x_i^{k-1} 
         \right) x_i^{j-1} 
         - \frac{1}{2} \left(\frac{\sigma}{\sigma_w}\right)^2 w_j = 0 
\end{align*}\right\} j=1..N
\]

<div class=watermark>
\[
\require{cancel}
\cancel{
\begin{align*}
\frac{\partial \psi}{\partial \sigma} = 0 \\
\therefore \sum_{i=1}^{M} \left\{ \left(y_i - \phi(x_i,\wv)\right)^2 - \sigma^2 \right\}    = 0 \\
\sigma =  \sqrt{ \frac{\sum_{i=1}^{M} (y_i - \phi(x_i,\wv))^2}{M}}  
\end{align*}
}
\]

\[
\require{cancel}
\cancel{
\begin{align*}
  \frac{\partial \psi}{\partial \sigma_w} = 0 \\
  \therefore \sum_{i=1}^{N} \left\{ 
    - \frac{1}{\sigma_w} + \frac{w_i^2}{\sigma_w^3}
    \right\}    = 0 \\
    \sigma_w =  \sqrt{ \frac{\sum_{j=1}^{N} w_j^2}{N}}  
\end{align*}
}
\]
</div>
<div>
 Realised that it is not possible to maximize with respect
 to $\sigma$ and $\sigma_w$ since they are conditional parameters
 based on which the posterior probability density function is
 constructed. They are not contingent on the data. But the question
 is how I can update my prior when I get additional data?
</div>
<div>
  The following figure shows results of polynomial fit
  based on maximal a posterior distribution. Input data
  set is generated from known distributions of polynomial
  coeffiecients $\wmv$ and random error in observed $y$.
  All of these distributions are assumed to be Normal with
  corresponding mean and standard deviations specified.
 
  The $(x,y)$ data generaded thus is used to evaluate point
  estimate of polynomial coefficients based on MAP algorithm
  described earlier. The effect of 
  assumed prior distribution parameters $\sigma$, $\sigma_w$ and
  $\wmv$ on the point estimate of $\wmv$ and associated polynomial
  trend is shown. The trend shows how prio can influence the fit.
  Also, a corresponding MLE fit with the same input data is
  shown, to demonstrate over fitting by MLE.
</div>
<figure class=figure  id="fig4"></figure>
</div>
`
