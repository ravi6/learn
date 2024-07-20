document.getElementById ("item4").innerHTML =
String.raw
`
  <div class=card-header>
    <h5> PDF of transformed random variable</h5>
  </div>
 <div class="card-body">
Given a random continuous variable $x$ with known PDF $P_X(x)$ determine the PDF of a transformed variable
$P_Y(y)$ with transformation $Y=g(X)$.

This is achieved expressing the CDF of transformed variable $Y$ in terms of CDF of original variable $X$.
with appropriate reverse transformation.

\[
\begin{align*}
F_Y (y) & =   P (Y < y)   =  P (g (X) < y) \\
& =  P (X < g^{-1} (y))
\textit{ (assuming g(x) is monotonically increases with x)  }  \\

& =  F_X \left( g^{-1} \left( y \right) \right)
\end{align*} 
\]

Note that $g^{-1}$ function refers to reverse mapping from Y to X.
Also, the requirement for the function $g(X)$ to be a monotonically
increasing function in the interval of interest is to ensure the inequality
is preserved during reverse mapping.

The PDF of transformed variable can now be determined with differentiation of above CDF with
respect to y.

\[
\begin{align*}
      P_Y(y) &= \frac{d}{dy} F_Y (y) = \frac{d}{dy} F_X ( g^{-1}(y) ) \\
             & = \frac{dx}{dy} \frac{d}{dx} F_X ( g^{-1}(y) )
	     =  \frac{dx}{dy}  P_X ( g^{-1} (y) ) \\ 
	     &=  \frac{d}{dy} (g^{-1}(y)) \   P_X ( g^{-1} (y) ) 
\end{align*}
\]

Although above result is derived for monotonically increasing $g(X)$,
for non-monotonic function case, one can segment the functions into 
monotonically increasing and decreasing segements and a generic result
can be obtained as follows.

Assuming the $g(X)$ has $k$ segments of montonically increasing or decreasing
regions,
\[
\begin{align*}
  P_Y(y) &= \sum_{i=1}^{k} \left | \frac{d}{dy} (g_k^{-1}(y)) \right |
             \   P_X ( g_k^{-1} (y) )   \ \ \ y \in Y 
\end{align*}
\]

Note the absolute sign on the derivative term is to account for effect of
sign change between monotonically increasing and decreasing function gradients.
<it>How one can do it for very complicated 
functions is not clear to me. 
</it>

But my interest is to find PDF of a function $g(x1, x2, x3)$  given  
$x1, x2, x3$ are members of a random variables with their respective PDF functions are known.
 </div>
`
