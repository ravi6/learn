document.getElementById ("item8").innerHTML =
String.raw
`
  <div class=card-header ><h5>
    Metropolis Monte Carlo Samping </h5>
  </div>
 <div class="card-body">
    <p class="card-text">
   This section deals with the strategies used to sample
from a complex unnormalized posterior distribution.
    </p>

<p class="card-text">
The metropolis algorithm steps are as follows.
<ol>
  <li> Start with arbitray initial sample $x_0$. </li>
  <li> Find the next proposed sample $x_p$ 
       from a Normal distribution
     $\mathcal{N}(x_c,\,\sigma^{2})$ where $x_c$ is current
     sample. The standard deviaion $\sigma$ is a parameter in
     the algorithm.
   </li>
   <li> Calculate acceptance ratio/probability of accepting the proposal
        as follows
	\[
	A = max \left( 1 , 
	\frac{p(x_p)}{p(x_c)}
	\frac
	{\mathcal{N}(x_c,\,\sigma^{2})}
	{\mathcal{N}(x_p,\,\sigma^{2})} 
	\right) \nonumber
         \]
   </li>
   <li> We accept the proposed new sample $x_p$ with the above probability.
        And this is done by drawing a random sample from uniform distribution
	between 0 and 1. If this number is less than $A$ we reject the proposed
	sample and if not we accept the proposal $x_p$. 
   </li>
   <li> Repeat steps from 2 with updated $x_c$ as per above criterion. </li> 

</ol>
<p>
It should be noted that the proposal sample is drawn from normal distribution
which is symmetric. The choice of proposal distribution is arbitrary.
However, a symmetric distribution simplifies acceptence ratio to
	\[
	A = max \left( 1 , 
	\frac{p(x_p)}{p(x_c)}
	\right) \nonumber
         \]

Indeed, if one chooses a non-symmetric distribution the algorithm corresponds
to Metropolis-Hastings McMc sampling. In the following test case a beta distribution
is chosen as unknown pdf to assess the performance of Metropolis algorithm.
</p>
<figure class=figure  id="figMetro"
      title="click mouse to alter sampling parameters"></figure>
 <div>

`
