%A way to compress coloured image
% with reduced SVD decomposition
% Author: Ravi Saripalli
% Date: 15th Sep. 2021

function morph()
  img = imread("f1.png"); img1 = make2D(img) ;
  [U1, S1, V1] = svd(img1.A);  %SVD decomposition
  img = imread("f2.png"); img2 = make2D(img) ;
  [U2, S2, V2] = svd(img2.A);  %SVD decomposition
  n = img1.N ;

  ip = 1 ;
  for alpha = [0.003 0.006 0.008 0.012]
    f = exp(-alpha * (n-1)) ;  % attenuation factor
    S1m = zeros(n,n);  S2m = S1m ;
    for i=1:n
	S1m(i,i) = S1(i,i) * (1-f) ; % squash significant modes
	k = n-i+1 ;
	S2m(k,k) = S2(k,k) * f  ; % magnify less significant modes
    end
    X = aprox(img1.N, U1, S1m, V1)  ...
	  + aprox(img2.N, U2, S2m, V2)  ;

    imgv = img1 ;
    imgv.A = X ;
    aimg = mkImg(imgv);
    subplot(2,2,ip) ; imshow(imrotate(aimg,90,nearest)); 
    title(sprintf("alpha= %5.4f",alpha)); 
    ip = ip + 1 ;
  end
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
      A((i-1)*C+k,j) = img(i,j,k) ;
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
