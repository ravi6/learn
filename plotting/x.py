import numpy as np
import matplotlib.pyplot as plt
import scipy.interpolate as interpld

x=np.arange(0,5,0.1)
y=np.exp(-x) * np.cos(2*np.pi*x)
z=np.exp(-x) * np.sin(2*np.pi*x)

fig=plt.figure(1)
plt.subplot(211)
plt.plot(x,y,'bo')

plt.subplot(212)
plt.plot(x,y,'go')

fig = plt.figure() 
ax=fig.add_subplot(111,projection='3d')
ax.plot3D(x,y,z,'green')


ax.plot3D(x,y,z,'o')
plt.show()
