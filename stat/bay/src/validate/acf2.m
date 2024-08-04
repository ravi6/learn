# Testing Autocorrelation function implementations
# with pure random numbers  ...
# Very interesting results:
#    1. Reversing the sample data does not change
#        auto correlatioin function trend
#    2. Using global mean or shifted sample mean
#       does not alter the result significantly
#
#
#N = 800 ;
#x = rand (N,1)' ;

data ; # get variable from data2
x = java.xs' ;
x = x(11:64) ;

function acc2 = accf2 (x, N)
  for i = 1:N
   xt = x(1:N-i+1) ;  xtp = x(i:N)  ;
   mut = mean (xt) ; mutp = mean (xtp) ;
   acov (i) =  (xt - mut) * (xtp - mutp)' ;  
    w  = (xt - mut) * (xt - mut)'  ; 
    wp  = (xtp - mutp) * (xtp - mutp)'  ; 
    d (i) = sqrt (w * wp)  ;
  endfor 
    acc2 = acov ./ d ;
    acc2 = fliplr(acc2); % because we want resulsts from few data pts to full set
endfunction

function acc1 = accf1 (x, N)
  mu = mean (x) ;
  for i = 1:N
   xt = x(1:N-i+1) ;  xtp = x(i:N)  ;
   acov (i) =  (xtp - mu) * (xt - mu)' ;  
    w  = (xt - mu) * (xt - mu)'  ; 
    wp  = (xtp - mu) * (xtp - mu)'  ; 
    d (i) = sqrt (w * wp)  ;
  endfor 
    acc1 = acov ./ d ;
    acc1 = fliplr(acc1);
endfunction

N = size(x,2) ;
ylim ([-1 1]) ;
z = accf1(x,N) ;
plot ([1:N], z,"*-;globalMean;", 'linewidth', 3, 'color', 'blue') ;
hold on ;

z = accf2(x,N) ;
plot ([1:N], z,"x-;slicedMean;", 'linewidth', 3, 'color', 'green') ;

plot ([1:size(java.acf,1)], java.acf',"o;java;", "linewidth", 3) ;
hold off ;



set(gca,"color", [0.9, 0.9, 0.9]) ;
set(gca,"fontsize", 20) ;
grid on ;

c.mean = [mean(x) java.mean];
c.std = [std(x)^2 java.sig2];
c.size = [N size(z,2)  size(java.acf,1)] ;

pause ;
