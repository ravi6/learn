document.getElementById ("navbar").innerHTML =
String.raw
`
  <div class="container-fluid">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" >
            Topics
          </a>
          <ul class="dropdown-menu" >
           <li><a class="dropdown-item" href="#item1">Bayesian Estimate of Discrete Distribution</a></li>
           <li><a class="dropdown-item" href="#item4">Beta Distribution</a></li>
           <li><a class="dropdown-item" href="#item2">Express discrete PDF as Contiuous PDF</a></li>
           <li><a class="dropdown-item" href="#item3">Transformed Variable PDF</a></li>
           <li><a class="dropdown-item" href="#item5">Linear Regression -MLE</a></li>
           <li><a class="dropdown-item" href="#item6">Linear Regression - MAP</a></li>
	   <li><a class="dropdown-item" href="#item7"> Conjugate Posterior Derivation</a></li>
	   <li><a class="dropdown-item" href="#item8"> Metropolis McMc sampling</a></li>
	   <li><a class="dropdown-item" href="#item9"> Hamiltonian Monte Carlo  sampling</a></li>
          </ul>
        </li>
      </ul>
</div>
`
