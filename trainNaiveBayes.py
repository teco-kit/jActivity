# Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import locale
locale.setlocale(locale.LC_ALL, 'German')
from sklearn.externals import joblib

# Metrics
from sklearn.metrics import classification_report

# Load Gaussian (NB = Naive Bayes) Classifier
from sklearn.naive_bayes import GaussianNB

# Load N-Fold Split
from sklearn.cross_validation import train_test_split

# Accuracy Score
from sklearn.metrics import accuracy_score

# Metrics
from sklearn.cross_validation import cross_val_score

#--------------------------------------------------------------------
#----------  Main ---------------------------------------------------
#--------------------------------------------------------------------

# Load data (Feature Vectors)
dataFV_1 = pd.read_csv(r'UserX_TaskY_FV.txt', sep=';')
dataFV_2 = pd.read_csv(r'UserX_TaskY_FV.txt', sep=';')
dataFV_3 = pd.read_csv(r'UserX_TaskY_FV.txt', sep=';')

# Delete Label
dataFV_1 = dataFV_1.drop("label", 1)
dataFV_2 = dataFV_2.drop("label", 1)
dataFV_3 = dataFV_3.drop("label", 1)

# Convert to NP-Array to use it for scikit-learn and training
npFeaturesFV_1 = dataFV_1.as_matrix()
npFeaturesFV_2 = dataFV_2.as_matrix()
npFeaturesFV_3 = dataFV_3.as_matrix()

# Create NP-Arrays for GroundTruth
npGroundTruthFV_1 = [1] * len(dataFV_1)
npGroundTruthFV_2 = [2] * len(dataFV_2)
npGroundTruthFV_3 = [3] * len(dataFV_3)

# Append dataFeatures and GroundTrruths for Classifier Training
dataFeatures = np.append(npFeaturesFV_1, npFeaturesFV_2, axis=0)
dataFeatures = np.append(dataFeatures, npFeaturesFV_3, axis=0)
dataGroundTruth = np.append(npGroundTruthFV_1, npGroundTruthFV_2)
dataGroundTruth = np.append(dataGroundTruth, npGroundTruthFV_3)

print(dataGroundTruth)

# Cross-Validation
gnbFeatures_train, gnbFeatures_test, gnbGT_train, gnbGT_test = train_test_split(dataFeatures, dataGroundTruth, test_size=0.33)
print(gnbFeatures_train)
print(len(gnbFeatures_train))
print(gnbFeatures_test)
print(len(gnbFeatures_test))
print(gnbGT_train)
print(gnbGT_test)

# Train Classifier
gnb = GaussianNB()
gnb.fit(gnbFeatures_train, gnbGT_train)

# Metrics
#scores = cross_val_score(gnb, gnbFeatures_test, gnbGT_test)
#print("Accuracy: %0.2f (+/- %0.2f)" % (scores.mean(), scores.std() * 2))

# Score-Test
print("Accuracy: %0.2f" % gnb.score(gnbFeatures_test, gnbGT_test))

target_names = ['Still', 'Swinging', 'Walking']
classReport = classification_report(gnbGT_test, gnb.predict(gnbFeatures_test), target_names=target_names)
accScore = accuracy_score(gnbGT_test, gnb.predict(gnbFeatures_test))
print(classReport)
print("Accuracy (total): %0.2f" % accScore)

print(gnb.sigma_)
print(gnb.theta_)

#joblib.dump(gnb, r'GNB.txt', compress=0)

#pickled = jsonpickle.encode(gnb)
#print(pickled)
#savePlace = open(r'GNB.txt', 'wb')
#savePlace.write(pickled)
#savePlace.close

# load it again
#model_clone = joblib.load(r'GNB.txt')

#print (model_clone.predict(npFeatures))

#print(gnb.get_params(True))
