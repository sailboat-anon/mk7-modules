import datetime

with open('/tmp/dateInfo.txt','a') as outFile:
    outFile.write('\n' + str(datetime.datetime.now()))
print('wrote it')