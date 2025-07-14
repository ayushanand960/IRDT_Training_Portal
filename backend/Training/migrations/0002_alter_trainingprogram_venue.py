
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Training', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainingprogram',
            name='venue',
            field=models.CharField(blank=True, choices=[('IRDT', 'IRDT'), ('NITTTR Chandigarh', 'NITTTR Chandigarh'), ('NITTTR Bhopal', 'NITTTR Bhopal'), ('IUCTE, Varanasi(UP)', 'IUCTE, Varanasi(UP)'), ('ESTC Ramnagar', 'ESTC Ramnagar'), ('IET, Luckhnow(UP)', 'IET, Luckhnow(UP)'), ('NCB Ballabgarh (Out Station)', 'NCB Ballabgarh (Out Station)')], max_length=100, null=True, verbose_name='Venue'),
        ),
    ]
