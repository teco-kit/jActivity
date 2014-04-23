# Copyright (c) 2014 Michael Hauber, TECO (Karlsruhe Institute of Technology, KIT)
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import locale
locale.setlocale(locale.LC_ALL, 'German')

dataTask1 = pd.read_csv(r'UserX_Task1_FeatureVector.txt', sep=';')
dataTask2 = pd.read_csv(r'UserX_Task2_FeatureVector.txt', sep=';')
dataTask3 = pd.read_csv(r'UserX_Task3_FeatureVector.txt', sep=';')

# Append dataFeatures and GroundTruths for Classifier Training
dataAlles = dataTask1.append(dataTask2)
dataAlles = dataAlles.append(dataTask3)
#dataAlles = dataAlles.append(dataStrassenbahn)

output = r'UserX_Appended_FeatureVector.txt'

dataAlles.to_csv(output, sep=';', na_rep='', index=False)

dataT1 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT2 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT3 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT4 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT5 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT6 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT7 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT8 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT9 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')
dataT10 = pd.read_csv(r'UserX_Appended_FeatureVector.txt', sep=';')

# Append dataFeatures and GroundTrruths for Classifier Training
dataAlles = dataT1.append(dataT2)
dataAlles = dataAlles.append(dataT3)
dataAlles = dataAlles.append(dataT4)
dataAlles = dataAlles.append(dataT5)
dataAlles = dataAlles.append(dataT6)
dataAlles = dataAlles.append(dataT7)
dataAlles = dataAlles.append(dataT8)
dataAlles = dataAlles.append(dataT9)
dataAlles = dataAlles.append(dataT10)

output = r'AllUsers_FeatureVector.txt'

dataAlles.to_csv(output, sep=';', na_rep='', index=False)