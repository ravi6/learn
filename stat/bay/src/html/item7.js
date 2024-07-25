document.getElementById ("item7").innerHTML =
String.raw
`
  <div class=card-header ><h5>
    Bayesian Posterior Distribution - with Conjugate Prior </h5>
  </div>
  <div class="card-body">
  To begin with we will assume that prior distribution of weights 
  of the linear fit of functions $\psiv(\xv)$ (In the case of polynomial
  fit they will be simple powers of $x$)
  are normally distributed with means
  $\muv_0$ with corresponding standard deviations
  $\sigma_{\wv}$. We will also assume that the 
  random error in measurement $\yv$ is 
  normal with mean zero and known standard deviation $\sigma$.
       \[
       \begin{align*}
         p(\wv | Data) \propto \sigma^{-2}
	    (\yv - \psiv \wv)^T (\yv -\psiv \wv)
	 + (\wv -{\muvn})^T \Svn (\wv - \muvn) \\ 
	 \text{where } \Svn = 
	 \begin{pmatrix}
	 \sigma_{w1}^{-2} & 0 & 0 & \cdots & 0 & 0 \\
	 0  & \sigma_{w2}^{-2} & 0  & \cdots  & 0 & 0 \\
	 0  & 0  & \sigma_{w3}^{-2} & \cdots  & 0  & 0\\
         \vdots  &   &   & \ddots \\
	 0  & \cdots & & 0 & \sigma_{w_{n-1}}^{-2} & 0 \\
	 0  & \cdots & & & 0  & \sigma_{w_n}^{-2}  
	 \end{pmatrix}
	 \end{align*}
       \]

    Note that suffix zero to denote prior values of standard deviations
    of distributions of weights $\wv$ was dropped in above 
    matrix to reduce clutter.

    A useful identiy that will come in handy when deriving posterior
    distribution with conjugate prior (eg. normal distributions)
    Consider symmetrix square matrix $\Av$ of size $n \times n$, and two column
    vectors $\muv, \wv$ of size $n$. Then
    $$ \wv^T  \Av \xv  = (\wv^T  \Av \xv )^T \  \text{because the product is a scalar} \nonumber $$
    It follows then 
    $$ \wv^T  \Av \xv  = {\xv}^T  \Av \wv  \nonumber $$
    And
       \[
	\begin{align*}
	  (\xv - \wv)^T \Av (\xv - \wv) &=
	   {\xv}^T \Av \xv - 2 {\xv}^T \Av \wv + {\wv}^T \Av \wv \\
	   &={\xv}^T \Av \xv - 2 {\wv}^T \Av \xv + {\wv}^T \Av \wv \\
	\end{align*}
       \]

We can now expand the terms of the conditional distribution of
weights $\wv$ using the useful identity described previously.

       \[
       \begin{align*}
         p(\wv | Data) \ \propto \ & 
	 \sigma^{-2} \left(
	 \yv^T \yv - 2  \yv^T \psiv \wv + \psiv \wv (\psiv \wv)^T
	 \right) \\
	 & + {\wv}^T \Svn \wv - 2 \wv^T \Svn {\muvn} + {\muvn}^T \Svn \muv \\
	 & = \sigma^{-2} \left(
	 \yv^T \yv - 2  \yv^T \psiv \wv + (\psiv \wv)^T (\psiv \wv) 
	 \right) \\
	 & \hspace{5mm} + {\wv}^T \Svn \wv - 2 \wv^T \Svn {\muvn} + {\muvn}^T \Svn \muv \\
	 & = \sigma^{-2} \left(
	 \yv^T \yv - 2 (\psiv \wv)^T \yv + \wv^T \psiv^T \psiv \wv 
	 \right) \\
	 & \hspace{5mm} + {\wv}^T \Svn \wv - 2 \wv^T \Svn {\muvn} + {\muvn}^T \Svn \muv \\
	 & = \sigma^{-2} \left(
	 \yv^T \yv - \color{blue}2  \wv^T \psiv^T \yv  + \color{red}\wv^T \psiv^T \psiv \wv 
	 \right) \\
	 & \hspace{5mm} + \color{red}{\wv}^T \Svn \wv \color{blue}
	 - 2 \wv^T \Svn {\muvn} \color{black} + {\muvn}^T \Svn \muvn \\
	 & = \color{red} \wv^T (\sigma^{-2} \psiv^T \psiv + \Svn) \wv 
	      \color{blue} - 2 \wv^T (\sigma^{-2} \psiv^T \yv + \Svn \muvn)
	      \color{black} + \sigma^{-2} \yv^T \yv + \muvn^T \Svn \muvn
	 \end{align*}
       \]
Now let us define
       \[
            \begin{align*}
	    \Sv &= \color{red} \sigma^{-2} \psiv^T \psiv + \Svn \\
		   \muv &= \Sv^{-1} 
	            \color{blue} (\sigma^{-2} \psiv^T \yv + \Svn \muvn) \\
	    \end{align*}
       \]

Then
       \[
       \begin{align*}
         p(\wv | Data) \ \propto \ & 
	   \color{red} \wv^T \Sv \wv 
	      \color{blue} - 2 \wv^T \Sv \muv
	      \color{black} + \sigma^{-2} \yv^T \yv + \muvn^T \Svn \muvn \\
          & \hspace{5mm} =  
	   \color{red} \wv^T \Sv \wv 
	      \color{blue} - 2 \wv^T \Sv \muv
	      \color{green}  + \muv^T \Sv \muv
	       - \muv^T \Sv \muv
	      \color{black} + \sigma^{-2} \yv^T \yv + \muvn^T \Svn \muvn \\
          & \hspace{5mm} =  
	      \color{green}  (\wv - \muv)^T \Sv (\wv - \muv) 
	      \color{black} - \muv^T \Sv \muv
	      + \sigma^{-2} \yv^T \yv + \muvn^T \Svn \muvn \\
	    \end{align*}
       \]
 Since our interest is the posterior distribution of $\wv$, the last
 three terms in the proportionality can be treated as constant since they
 do not involve $\wv$. The first term has the form of normal distribution
 of $\wv$ with associated mean $\muv$ and stadandar deviation $\Sv^{-1}$.

 Now one can see how posterior distribution of $\wv$ can be updated easily
 with the help of expressions for $\Sv$ and $\muv$ with new data $(\xv, \yv)$

 Also, it is now possible to derive distribution of predicted value
 of $y^*$ at any new $x^*$ value as following.

Using Bayesian rule
       \[
       \begin{align*}
         p(y^* | Data) \ = p(y^* | \wv, \muv, \Sv) * p(\wv | Data) \\
       \end{align*}
       \]

Noting that the $y^*$ is distributed normallay around mean value of
$\wv^T \psiv^*$ with variance of $\sigma$. (Note that $\psiv^* = 
[\phi_1(x^*),\ \phi_2(x^*),\ \dots\ \phi_N(x^*)]^T$
       \[
       \begin{align*}
         p(y^* | Data) \ \propto \ &
            \sigma^{-2} (\ys - \wv^T \psiv^*)^2 + 
	    (\wv - \muv)^T \Sv (\wv - \muv)
	     \\
          & \hspace{3mm} =  
	  \sigma^{-2} \left \{ \ysq - 2 \ys \wv^T \psiv^* + (\wv^T \psiv^*)^2 \right \} +
	    \wv^T \Sv \wv 
	       - 2 \wv^T \Sv \muv
	       + \muv^T \Sv \muv
	       \\
          & \hspace{5mm} =  
	  \sigma^{-2} \left \{ \ysq - 2 \ys \wv^T \psiv^* + \wv^T {\psiv^*} {\psiv^*}^T \wv \right \} +
	    \wv^T \Sv \wv 
	       - 2 \wv^T \Sv \muv
	       + \muv^T \Sv \muv \\

          & \hspace{5mm} =  
	  \sigma^{-2} {\ys}^2 + \muv^T \Sv \muv
	  - 2  \wv^T (\Sv \muv + \sigma^{-2} \ys \psiv^* )
	  + \wv^T (\Sv + \sigma^{-2} {\psiv^*} {\psiv^*}^T) \wv
	    \end{align*}
       \]

Defining
       \[
            \begin{align*}
	    \Lv &= \Sv + \sigma^{-2} {\psiv^*} {\psiv^*}^T \\
	    \Mv &= \Lv^{-1} (\Sv \muv + \sigma^{-2} \ys \psiv^{*}) \\
	    \end{align*}
       \]
       \[
        \begin{align*}
         p(y^* | Data) \ \propto \ 
	  + \color{blue} \half (\wv - \Mv)^T \Lv (\wv - \Mv) \color{green}
	  + \half \sigma^{-2} {\ys}^2 
	  - \half \Mv^T \Lv \Mv  + \color{red} \half \muv^T \Sv \muv
	    \end{align*}
       \]
Noting that the last term in the above does not invlolve either $\ys$ or $\wv$ terms,
it can be deemed constant and ignored. And now we have the predictive distribution as function product of 
two functions (1) One involving only $\wv$ and other involving just $\ys$. Since the term in blue 
represents the form of a Normal distribution and is the only term containing $\wv$ it integrates
out over all possible $\wv$ to unity. As a consequence, the predictive distribution of
$\ys$ is proportional to

       \[
        \begin{align*}
         p(y^* | Data) \ \propto \ & 
	   \half \sigma^{-2} {\ys}^2  - \half \Mv^T \Lv \Mv  \\
          & \hspace{2mm} =  
	  \half \left( \sigma^{-2} \ysq  - (\Sv \muv + \sigma^{-2} \ys \psiv^*)^T \Lv^{-1} \Lv \Lv^{-1} 
	   (\Sv \muv + \sigma^{-2} \ys \psiv^*) \right) \\
	  & = \half \left( \sigma^{-2} \ysq  
	  - \sigma^{-4} \ysq {\psiv^{*}}^T \Lv^{-1} \psiv^{*}
	  - 2 \sigma^{-2} \ys {\psiv^{*}}^T \Lv^{-1} \Sv \muv 
	  -  \muv^T \Sv^T \Lv^{-1} \Sv \muv \right) \\
	  & = \half \ysq \left( \sigma^{-2}   
	  - \sigma^{-4}  {\psiv^{*}}^T \Lv^{-1} \psiv^{*} \right)
	  -  \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \Sv \muv \ys 
	  -  \color{red} \half \muv^T \Sv^T \Lv^{-1} \Sv \muv 
	    \end{align*}
       \]

Defining
      \[
            \begin{align*}
	    {\sigys}^{-2}&= \sigma^{-2}(1 - \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \psiv^{*}) \\
	    \muys {\sigys}^{-2}&= \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \Sv \muv \\
	    \end{align*}
      \]

       \[
        \begin{align*}
         p(y^* | Data) \ \propto \ & 
	 \frac{(y^* - \muys)^2}{2 {\sigys}^{2}}
	 - {{\muys}^2}{{\sigys}^{2}}
	  -  \color{red} \half \muv^T \Sv^T \Lv^{-1} \Sv \muv 
         \end{align*}
      \]
Neglecting the last two terms that are not dependant on $y^*$, clearly
the predictive distribution is also a normal distribution 
$\NDist{y^*}{\muys}{\sigys}$.

We can now evaluate the distribution parameters using the above definitions
as follows.

      \[
            \begin{align*}
	    \muys =  \frac { {\psiv^{*}}^T \Lv^{-1} \Sv \muv }
	    {1 - \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \psiv^{*} } \\
	    \end{align*}
      \]

      Noting that (being scalar expression)
      \[
            \begin{align*}
	        {\psiv^{*}}^T \Lv^{-1} \Sv \muv
		&= ({\psiv^{*}}^T \Lv^{-1} \Sv \muv )^T \\
		&= \muv^T \Sv^T \Lv^{-1} \psiv^{*}  \text{ ... note that inverse of L is symmetric} \\

	    \muys &=  \frac { \muv^T \Sv^T \Lv^{-1} \psiv^{*} } 
	    {1 - \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \psiv^{*} } \\
	    and \\

	    \Sv &= \Lv - \sigma^{-2} \psiv^{*} {\psiv^{*}}^T \\
	    \text{then} \\
	    \Sv^T \Lv^{-1} &= I - \sigma^{-2} \psiv^{*} {\psiv^{*}}^T \Lv^{-1} \\
	    \Sv^T \Lv^{-1} \psiv^{*}  &= \psiv^{*} - \sigma^{-2} \psiv^{*} {\psiv^{*}}^T \Lv^{-1} \psiv^{*} \\
	     &= \psiv^{*} (1  - \sigma^{-2} {\psiv^{*}}^T \Lv^{-1} \psiv^{*}) \\
	    \end{align*}
     \]
 Substituting the above expression the mean of the predicted 
 variable $\muys$ simply turns out to be 
 \[
  \begin{align*}
     \color{blue} \muys = \muv^T \psiv^{*}
  \end{align*}
 \]
 In essence the mean of predicted value coresponds to linear regression
 fit corresponding to mean of corresponding weights which are normally distributed.
 Since regression is linear in weights, intutively one should expect the result
 we found.

 It is of interest to find the variance $\sigys$
 of the predicted value $y^*$. From above analysis it is clear that $\sigys$
 depends on $\Lv^{-1}$. This in turn it is sum of $\Sv$ and $\psiv^*$. 
 Since $\Sv$ does not change for each new predicted value, it is of interest
 to see if inverse $\Lv$ can be expressed in terms of inverse of $\Sv$ which
 need evaluated only once. And indeed there exists a matrix identity that
 can decompose inverse of sum of two matrices into its constituents. One such 
 identity that is specific to the form of our interest is given by 
 <a href=https://en.wikipedia.org/wiki/Sherman%E2%80%93Morrison_formula">Sherman and Morrison</a>

 \[
  \begin{align*}
  (A+uv^T)^{-1} = \frac{A^{-1} - A^{-1}uv^TA{-1}}
                       {1+v^TA^{-1}u}
  \end{align*}
 \]
 Using the above identity the expression for the variance of the
 predictive value $y^*$ can be expressed as follows.

 \[
  \begin{align*}
    {\sigys}^{-2} &= \sigma^{-2}
    \left( 
        1 - \sigma^{-2} \psivsT \Lv^{-1} \psivs 
     \right) \\
    &= \sigma^{-2}
    \left\{
      1 - \sigma^{-2} \psivsT 
        \left(
           \Svinv \psivs - 
	   \frac{\sigma^{-2} \Svinv \psivs \psivsT \Svinv \psivs} 
            {1 + \sigma^{-2}\psivsT \Svinv \psivs}
         \right)
    \right\} \\
  \end{align*}
 \]

 Noting that $\psivsT \Svinv \psivs$ is a scalar and defining that
 quantity as $\beta$.

 \[
  \begin{align*}
    {\sigys}^{-2} &= \sigma^{-2}
    \left\{
      1 - \sigma^{-2} \beta 
        \left(
           1 - 
	   \frac{\sigma^{-2} \beta}
	        {1 + \sigma^{-2} \beta}
         \right)
    \right\} \\
    &= \frac{\sigma^{-2}}{1+\beta \sigma^{-2}}
  \end{align*}
 \]
 This finally gives us a very neat expression for
 variance of the distribution of the predicted value.
\[
  \begin{align*}
 \color{blue}
 {\sigys}^{2} = \sigma^{2} + \psivsT \Svinv \psivs
  \end{align*}
\]
It is of interest to note that we can decompose the
variance of predicted value into two components, one that
is due to the error in measurement, and the other due to 
the uncertainity associated with the weights of the linear regression.
As much as it is such a gruelling process to get to this 
very elegant result it was very satisfying 
(albeit with lot of help from  web based lectures :()  
In particular, I owe my comprehension of this derivation
to the excellent lecture series on youtube
by <a href=https://www.youtube.com/watch?v=vTcsacTqlfQ&t=3s>mathematicalmonk</a>


<div>
  <p>
  Following my intial statement that using the posterior estimate
of joint distribution of weights $\wv$ can be used iteratively as
prior to a new data set of $\xv, \yv$, I tried the following experiment.
Generated data with first sampling all weights from corresponding
individual normal distributions with known means and associated standard
deviations. Using the sampled weights determine $y_m$ for an arbitrary $x$
as polynomial value. The $y$ value corresponding to the chosen $x$ is sampled
from $\NDist{y}{y_m}{\sigma}$.
The $\muv, \Sv$ parameters of the posterior distribution of
the joint distribution of $\wv$ of each data set is used as a prior
to the following set of data generated. 
  </p>
<div>
These experiments revealed the
follwoing trends

<ul>
  <li> The $\muv$ vector of posterior is close to the mean 
       after few iteraitons.
  </li>
  <li> The covariance vector $\Sv$ off diagonal components do 
       not converge to small values as I initially anticipated
       because I was expecting this posterior to converge to
       joint distribution of $\wv$ from which data is generated.
  </li>
  <li> Even the diagonal elements of the $\Sv$ have not approached
       values that correspond to the $\sigma_w^{-2}$ of correspnding
       weight distributions.
  </li>
</ul>
  <p>
       Finally the penny dropped for me (I think).
       The joint distribution of $\wv$
       condtioned on set of $x,y$ data is not the same as the 
       joint distribution of the $\wv$ that is unconditional.
       In the later case the  co-variance matrix is indeed diagonal
       for all members of $\wv$ are independant of each other.
       However, in the conditional case $\wv$ members are 
       no longer independant variables but are inter linked
       through $x,y$ data.
   </p>
   </p>
       It is worth noting at any given $x$ value corresponding
       $y$ value is a linear of combination of $\wv$ members
       whose coefficients are specified functions of $x$.
       As a consequence, if there is no error in measurement of
       $y$ one can see that it corresponds to multivariate normal
       distribution beacuse it is a linear sum of individual
       normal distributions. As an extension, one could
       see that a measurement error in $y$ that is Normally distributed
       can be included as additional random variable.</li>
  </p>
   <p>
       But one need to ask how it was possible to
       write the posterior estimate where the multiplicant
       of the likelyhood function is joint distribution
       of $\wv$ as if $\wv$ members were independant.(perhaps it is
       a good starting point??).
  </p>
<p>
Whenever a new sample data is obtained the process can be repeated 
with posterior estimate of the past as a prior. Since each sample outcome
is independant one would expect, with enough batches of samples the 
posterior would converge to the orginal batch distribution.
</p>

<p> At a later stage we will explore how a new sample can be drawn
from the posterior that would reduce the uncertainity in the model
predictions based on posterior. Since the posterior is not normalized and
is often very complex, the need to find methods that can draw samples
from such distribution will be explored below.
</p>
<figure class=figure  id="fig5" 
	title="click to add more samples" ></figure>
</div>
`
