# Copyright (c) 2014 Michael Hauber
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import locale
locale.setlocale(locale.LC_ALL, 'German')

# Load SVM Classifier
from sklearn import svm

#--------------------------------------------------------------------
#----------  Main ---------------------------------------------------
#--------------------------------------------------------------------

# Load data (Feature Vectors)
dataFV_1 = pd.read_csv(r'UserX_TaskY_FeatureVector.txt', sep=';')
#dataFV_2 = pd.read_csv(r'UserX_TaskY_FeatureVector.txt', sep=';')

print(dataFV_1.head());

# Delete Label
dataFV_1 = dataFV_1.drop("label", 1)
# Convert to NP-Array to use it for scikit-learn and training

# IMPORTANT: This wasn't programmed entirely to the end, look at trainNaiveBayes.py to see how it's done!
npFeatures = dataFV_1.as_matrix()
npGroundTruth = [1] * len(dataFV_1)

npGroundTruth = np.array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2])

print(npFeatures)
print(npGroundTruth)
print(npFeatures[0])
# Combine (Concatenate Feature Vectors + Ground Truth Vectors)

svmClf = svm.SVC()
svmClf = svmClf.fit(npFeatures, npGroundTruth)
print (svmClf.predict(npFeatures))