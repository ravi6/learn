document.getElementById ("item9").innerHTML =
String.raw
`
  <div class=card-header ><h5>
    Hamiltonian Monte Carlo Samping </h5>
  </div>
 <div class="card-body">
    <p class="card-text">
  Hamiltonion mechanics, the Hamiltonion is sum of
potential and kinetic energy terms as follows

   \[
     H (x, p) = \phi (x) + \psi (p)   \nonumber    
   \]

Here $H$ is function of position vector $x$ and momentum vector $p$
and is composed of potential energy part which is function of $x$,
and kinetic kinetic energy part which function of momentum $p$.

   \[
   \begin{align*}
   \frac{\partial H}{\partial x} &= \frac{d\phi}{dx}  \nonumber \\
   \frac{\partial H}{\partial p} &= \frac{d\psi}{dp}  \nonumber \\
   \frac{dH}{dt} &= \frac{d\phi}{dx} \frac{dx}{dt}  
                    +  \frac{d\psi}{dp} \frac{dp}{dt}  \nonumber \\
   \end{align*}
   \]

Since $H$ is total energy that is time invarient the following relations
would satisfy such requirement. 
   \[
   \begin{align}
      \frac{dx}{dt}  =  - \frac{\partial H}{\partial p}  \\ 
       \frac{dp}{dt} = \frac{\partial H}{\partial x} 
   \end{align}
   \]
 </p>

<p class=card-text>
Let us now define negative log of the 
unnormalised complex distribution $u(x)$  (often encountered in Bayesian 
posterior distribution) as potential energy. Also define a kinetic energy
term as the negative log of
momentum distribution 
     $f(p) = \mathcal{N}(0,\,\sigma^{2})$
</p>
   \[
   \begin{align}
      H (x, p)  =  - log \left\{u(x)\right \}+  
                   \frac{p^2}{2\sigma^2}  
   \end{align}
   \]

<p>
The above Hamiltonion is convex in $x$ and $p$.
Minimization of $H$ would then yield the  most probable $x$ 
and $p$ values corresponding to the respective distributions. 
</p>

<p>
Since momentum distribtion
is centernred around  zero, it is possible to seek all possible
samples of $x$ corresponding to $u(x)$ for any arbitrary choice variance
$\sigma$.
</p>


<p>
Invoking Hamiltonian mechnics analogy $H$ is conserved quantity.
Consequently sampling of $x$ from $u(x)$
involves  the use of equations 4 and 5.
Integrating time derivatives of $x$ and $p$
for an arbitrary period of time $T$.
and accept the new value of $x$ if
it corresponds to lower $H$ value than at the start of integration.
The probalistic component is introudced through sampling of a new
momentum at every time step from  
     $\mathcal{N}(0,\,\sigma^{2})$
</p>


   \[
   \begin{align}
      \frac{dx}{dt}  &= \frac{p}{\sigma^2} \\ 
       \frac{dp}{dt} &= \frac{d}{dx}[-log(u(x)]
   \end{align}
   \]
<p> It is worth noting that when RHS of equaiton 8
can not be evaluated analytically, a numerical approximation
is employed.
</p>


<p class="card-text">
The Hamiltonion algorithm steps can be summarised as follows.
<ol>
  <li> Start with arbitray initial momentum  $p_o$
       from $\mathcal{N}(0,\,\sigma^{2})$, and a starting
       sample $x=x_o$.
  </li>
  <li> 
       Numerically integrate equations 7 & 8 for an arbitrary
       time period $T$.  This step will yield new vales of $x_n$ and
       $p_n$ at time step $T$.
   </li>
   <li> Calculate acceptance probability of the new position
        based on Hamiltonion values at the start and end of
	the time step.
        \[
	   A = min \left\{ 1, 
	      e^{ \left( H (x_o, p_o) - H (x_n, p_n) \right) }
	   \right\}
         \]
   </li>
   <li> We accept the proposed new sample $x_n$ with the above probability.
        And this is done by drawing a random sample from uniform distribution
	between 0 and 1. If this number is less than $A$ we reject the proposed
	sample and if not we accept the proposal $x_n$. It is to be noted
	that this strategy ensures that we move in the direction of decreasing
	$H$. It is to be noted that during the integration step 
	the Hamiltonion value is preserved.
   </li>
   <li> We repeat the above steps with $x_o$ updated to $x_n$ if sample was
        accepted or else with no change to $x_o$ if the sample is rejected.
   </li>
</ol>

 <p> Overall the algorithm has two parameters $T and \sigma$ that can be tuned
 to maximise the acceptance ratio of samples explored. The following figure
demonstrates how the algorithm performs with varied parameters. For testing purposes
the target distribution is assumed to be normal. </p>

  <figure class=figure  id="figHam" 
      title="click mouse to alter sampling parameters"></figure>
 </div>

<p> Numerical integration of equations 8 and 9 employs well known LeapFrog method
that minimises accumulation of integration error with time step splitting
as follows. Here $\delta t$ is the fractional time step used to integrate equations
8 and 9 over the time period $T$.
</p>

    \[
       \begin{align*}
        p \left(t + \frac{\delta t}{2}\right) 
	   &= p (t) -  \frac{\delta t}{2}  * 
                           \frac{d}{dx}[-log(u(x)] \Bigg|_{x(t)} \\

        x (t + \delta t) &= x (t) + \delta t * 
        p \left(t + \frac{\delta t}{2}\right)  \\

        p \left(t + \delta \right) &=
        p \left(t + \frac{\delta t}{2}\right)  
	    -  \frac{\delta t}{2}  * 
                           \frac{d}{dx}[-log(u(x)] \Bigg|_{x(t+\frac{\delta}{2})} \\

       \end{align*}
    \]
</p>
<h4>Some illuminating links on Hamiltonion Sampling </h4>
<a href="https://danieltakeshi.github.io/2017/12/18/on-the-momentum-sign-flipping-for-hamiltonian-monte-carlo/">MomentumSignFlipping</a>
<a href="https://stats.stackexchange.com/questions/324346/hamiltonian-monte-carlo-how-to-make-sense-of-the-metropolis-hasting-proposal">Conservation of H</a>
<a href="https://blog.djnavarro.net/posts/2023-04-12_metropolis-hastings/">Metropolis-Hastings</a>
`
