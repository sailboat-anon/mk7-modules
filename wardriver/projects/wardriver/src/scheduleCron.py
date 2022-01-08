import datetime
from crontab import CronTab

my_cron = CronTab(user='sba')
job = my_cron.new(command='/usr/local/bin/python3 /Users/sba/mk7-modules/wardriver/projects/wardriver/src/writeDate.py >> /Users/sba/mk7-modules/wardriver/projects/wardriver/src/pylog.txt 2>&1')
job.minute.every(1)
my_cron.write()
for job in my_cron:
    sch = job.schedule(date_from=datetime.datetime.now())
    print(sch.get_next())
