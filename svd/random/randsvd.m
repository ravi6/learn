function randsvd(pComp)
%% Exploring Random SVD
%% Author: Ravi Saripalli
%% Date: 20th Sep. 2021

  img = imread("coffee.jpg");
  imgv = make2D(img) ;
  %Specify eigen modes of interest
  % through compression level (pComp)
  r = round((imgv.N * pComp)/100);

  % Venilla SVD
  tic() ;
  [U, S, V] = svd(imgv.A);  %SVD decomposition
  X = aprox(r, U, S, V)  ;  %using Truncated SVD (rank r)
  printf("Venilla: %d \n", toc()) ;
  
  subplot(1,2,1);
  imgv.A = X ; imshow(mkImg(imgv)); title("venilla"); 

  %Random SVD
  tic();
  [U, S, V] = rsvd(imgv.A, r) ;
  X2 = aprox(r, U, S, V) ;
  printf("Random: %d \n", toc()) ;
  subplot(1,2,2);
  imgv.A = X2 ; imshow(mkImg(imgv)); title("random"); 
end

function [U, S, V] = rsvd(A, r) 
  %Using randomized svd algorithm
  %generate SVD and return approximated A
  M = size(A,1) ; N = size(A,2) ;

  %Generate Gaussian Random Matrix of size Nxr
  G = rand(N, r) ;
  Y = A * G ;  %Project A on to the random basis (Mxr)

  %We use economy QR factorization (M>N, to get Q=Mxr R=rxr)
  % If the second argument of qr is not zeror Q=MxM R=Mxr
  [Q, R] = qr(Y, 0) ; % Get qr Decomposition of Y

  % Compute the SVD of Q'A  (rxM MxN = rxN) 
  [U, S, V] = svd(Q'*A) ;

  % SVD of Aprroximated A will be simply
  U = Q * U ;  % note S, V will not change
end

function X = aprox(r, U, S, V )
  %SVD truncated solution
  Ur = U(:,1:r) ;
  Sr = S(1:r,1:r) ;
  Vr = V(:,1:r) ;
  X = Ur * Sr * Vr' ;
end

function imgv = make2D(img)
  % Convert color image to 2D matrix
  % Return my own img data structure
  [M N C] = size(img) ;  %C color data size
  for j = 1:N
   for i = 1:M
    for k = 1:C
      A((i-1)*C+k,j) = double(img(i,j,k)) ;
     end
    end
  end
  imgv.M = M ; imgv.N = N ; imgv.C = C ;
  imgv.A = A ;
end % end function

function img = mkImg(imgv)
  % Rejig  back  to image
  for j = 1:imgv.N
   for i = 1:imgv.M
    for k = 1:imgv.C
      % Don't know why I need to scale it with 256
      % for reconstructed image to display correctly
      img(i,j,k) = abs(imgv.A((i-1)*imgv.C+k,j))/256  ;
     end
    end
  end
end
