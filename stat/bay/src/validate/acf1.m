# Testing Autocorrelation function implementations
# with pure random numbers  ...
#     ACF trends change even with reversing the
#      random data 
#    But as such it does still show large fluctuations
#    at the end. ie. as the lag increases.
#      This is my bad. ... Realised that I have to
#      flip the output as I was moving from full set to
#      reduced set as I iterate through. So the the array
#      of Autocorrelation function need to be flipped.
#    Perhaps the mean should local mean of the shifted
#    data rather than the global mean
#    We will try that in another script

dummy = 100;
function acc = accf (opt, N)
  x = rand (N,1)' ;
  mu = mean (x) ;
  sig2 = std (x) ^ 2; 

for k = 1:2
  for i = 1:N-1
   acov (i) =  (x(1:N-i) - mu) * (x(i+1:N) - mu)' ;  
    v = (x(i+1:N) - mu) * (x(i+1:N) - mu)' ;
    w  = (x(1:N-i) -mu) * (x(1:N-i) - mu)'  ; 
    d (i) = sqrt (v * w)  ;
  endfor 

  if (opt == 1) 
    acc(k,:) = acov ./ ((N - 1) * sig2) ;
  elseif (opt == 2)
    acc(k,:)= acov ./ (( N - [1:N-1] ) * sig2) ;
  else
    acc (k,:)= acov ./ d ;
  endif

  x = fliplr(x) ;  
endfor
endfunction


N = 10000 ;
ymax = 0.2 ;
leg = {"-;Wiki;"; "-;Matlab;"; "-;TextBook;"};
for k = 1:3
  subplot(3,1,k);
  z = accf(k,N); 
  plot ([1:N-1], fliplr(z(1,:)),leg{k}) ;
  ylim ([0 ymax]) ;
  hold on ;
  plot ([1:N-1], fliplr(z(2,:)),leg{k}) ;
  hold off ;
endfor

