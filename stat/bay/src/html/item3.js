document.getElementById ("item3").innerHTML =
String.raw
`
<div class=card-header>
<h5>Expressing Discrete PDF as a continuous function </h5>
</div>
<div class="card-body">
<p class=card-text>
Consider a discrete distribution  function  
\[ f(x_i) = p_k  \ \ \ x_i \in \{ x_1, x_2, ... x_n \} \nonumber \]
Its cumulative distribution 
\[ F(x < x_k) = \sum_{i=1}^{k} p_k \nonumber \]
This function can be expressed as continuous CDF in x with the help of step functions
 \[ F(x) = \sum_{i=1}^{k} f(x_i) S(x-x_i)  \ \ \  x_1 < x < x_n \nonumber \]
where
\[
S(x)=
\begin{cases}
0, & \text{if } x < 0\\
1, & \text{otherwise}
\end{cases} \nonumber
\]
If we differentiate the above function we should get continuous equivalent of discrete distribution $P(x_i)$
\[
f(x) = \frac{dF}{dx} = \sum_{i=1}^{k}
f(x_i) \delta(x-x_i)  \ \ \  x_1 < x < x_n \nonumber
\]
</p>
</div>
`
