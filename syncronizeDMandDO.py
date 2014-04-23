# Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import locale
locale.setlocale(locale.LC_ALL, 'German')


def convertToTimeSeries(data):
    # convert from UNIX timestamp to datetime/panda format.
    data['timestamp'] = data['timestamp'].map(lambda x: x.astype('datetime64[ms]'))
    # sorting values, if something isn't in the right order
    data = data.sort(['timestamp'], ascending=[1])
    # needs to be index for a timeSeries data object in python/pandas
    data = data.set_index('timestamp')
    return data

def upsampleTo(hertz, data):
    # "L" is milliseconds! Therefore L equals 1000 Hertz
    return data.resample(hertz, fill_method="ffill")

# It simply adds another column called label with the labels ID.
def labelDataFrame(labelID, data):
    groundTruth = [labelID] * len(data)
    print(len(data))
    data["label"] = groundTruth
    return data

# windowLength in MilliSecond
# rollingFactor im Bereich von (0,1]
# data: upsampled data to 1000 Hertz
def createFeatureVector(windowLength, rollingFactor, data):
    stride = int(rollingFactor * windowLength) # z.B. bei windowLength = 2000, rollingFactor = 0.5 => stride = 1000
    # Feature 1: Mean
    dataMeanStride_list = [ data[i:i+windowLength].mean() for i in range (0, len(data), stride) if i+windowLength <= len(data) ]
    dataMeanStride = pd.DataFrame(dataMeanStride_list)
    # Feature 2: Variance
    dataVarStride_list = [ data[i:i+windowLength].var() for i in range (0, len(data), stride) if i+windowLength <= len(data) ]
    dataVarStride = pd.DataFrame(dataVarStride_list)
    # Naming Feature-Columns right
    dataVarStride.rename(columns=lambda x: x + "_var", inplace=True)
    dataMeanStride.rename(columns=lambda x: x + "_mean", inplace=True)
    return dataMeanStride.join(dataVarStride)



#--------------------------------------------------------------------
#----------  Main ---------------------------------------------------
#--------------------------------------------------------------------

# Load data (DM + DO) + Define Label + Define Output
label = "Sitzen"
dataDO = pd.read_csv(r'UserX_TaskY_DeviceMotion.txt', sep=';')
dataDM = pd.read_csv(r'UserX_TaskY_DeviceOrientation.txt', sep=';')
output = r'USerX_TaskY_FeatureVector.txt'
windowLength = 2000
rollingFactor = 0.5

# Convert To TimeSeries
dataDO = convertToTimeSeries(dataDO)
dataDM = convertToTimeSeries(dataDM)
print(dataDO)

# Drop OCC-Column
dataDM = dataDM.drop("OCC", 1)
dataDO = dataDO.drop("OCC", 1)

# Upsample to 1000 Hertz
dataDM = upsampleTo("L", dataDM)
dataDO = upsampleTo("L", dataDO)

# Join and Synchronize (DM + DO)
dataJoined = dataDM.join(dataDO, how='inner')

# Create FeatureVector
dataFeatureVector = createFeatureVector(windowLength, rollingFactor, dataJoined)

# To merge two FeatureVectors: use dataMerged = dataFeatureVector1.append(dataFeatureVector2)

# Convert to NP-Array to use it for scikit-learn and training
dataNP = dataFeatureVector.as_matrix()
# DEBUG-Print:
# print(dataNP)

# Save NP-Feature-Vector
# np.savetxt('np_featureVector.txt', x, delimiter=';')

# Label the Feature Vector!
dataFeaturesAndLabelled = labelDataFrame(label, dataFeatureVector)

# Save Pandas-Dataframe to .csv
dataFeaturesAndLabelled.to_csv(output, sep=';', na_rep='', index=False)
# DEBUG-Print:
# print(dataFeaturesAndLabelled['x-zerograv_mean'])