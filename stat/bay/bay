%My Explorations with Bayesian Theory

function pdf = getPD(pdf, d)
  %Get discrerte pd from samples x
    pdf.count(:,1) =  zeros(size(pdf.p)) ;
    for i = 1: size(d)
      for j = 1 : size(pdf.p)
         if (d(i) == pdf.x(j)) 
           pdf.count(j,1) = pdf.count(j,1) + 1 ; 
         endif
      end
    end
    pdf.p = pdf.count / sum(pdf.count) ;
    pdf.E = E(pdf) ;   
endfunction

function xm = E(pdf)
  %Evaluate expected Value of PDF
  n = size(pdf.p) ;
  xm = 0 ;
  for i = 1:n
   xm = xm + pdf.p(i) * pdf.x(i) ;
  end
endfunction

function y = sample(N, pdf)
  % Generate a sample of size N 
  % Given a probability distribution (discrete)
  % Get Cumulative pdf
   pdf.pc(1) = pdf.p(1) ;
   for i = 2 : size(pdf.p) ;
    pdf.pc(i) = pdf.pc(i-1) + pdf.p(i) ;
   end

  % Now pick N random samples from pdf
    for n = 1:N
      r = rand() ; 
      for k = 1:size(pdf.p)
         if (r < pdf.pc(k) )
           break ;
         end
      end
      y(n,1) = pdf.x(k) ;  
    end
endfunction

function pdf = testme(N)
%The acid test
    pdf.x=[1,2,3]';
    pdf.p=[0.2,0.5,0.3]' ; 
    y = sample(N, pdf); 
    pdf = getPD(pdf, y); 
end

function bay()

% Consider a known PDF
% This is the one I will try estimate
    pdfA.x=[1,2,3]';
    pdfA.p=[0.2,0.5,0.3]' ; 
    pdfA.E = E(pdfA) ;

% Take one sample from pdfA
    y = sample(1, pdfA)  

% Say guessed (prior) PDF is
    pdfG.x = [1,2,3]' ;
    pdfG.p=[0.1,0.1,0.8]' ; 
    pdfG.E = E(pdfG) ;

% Calculate Posterior PDF
    pdfP.x = pdfG.x ;
    pdfP.p(1)

end 
