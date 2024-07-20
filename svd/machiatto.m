function machiatto()
%%A way to compress coloured image
%% with reduced SVD decomposition
%% Author: Ravi Saripalli
%% Date: 15th Sep. 2021

  display("Be patient ...it is brewing :))");
  img = imread("coffee.jpg");
  imgv = make2D(img) ;
  close all ;
  A = imgv.A ;
  [U, S, V] = svd(A);  %SVD decomposition
  k = 1  ; figure ;
  for p = [10:20:80]  % Try different levels of truncation
    j = round(p*imgv.N/100) ;
    X = aprox(j, U, S, V)  ;
    err2 = (X-A) .* (X-A) ;
    res(k)= sum(sum(err2))/(imgv.M * imgv.N) ;
    xval(k) = j ;
    k = k + 1 ;
    imgv.A = X ;
    aimg = mkImg(imgv);
    subplot(2,2,k-1) ; imshow(aimg) ;
    title(sprintf("Eigen Modes: %d" ,j));
  end
  figure ;
  plot(xval,res,'o-');
  xlabel("Number of Modes");
  ylabel("Aproximation Error");
  title("Truncating SVD");
  grid on ;
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
      %Need that conversion if I need A to be
      % used in math operations
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
