from django.db import migrations


def expand_supplier_text_fields(apps, schema_editor):
    if schema_editor.connection.vendor != "postgresql":
        return

    with schema_editor.connection.cursor() as cursor:
        cursor.execute(
            """
            ALTER TABLE purchases_supplier
            ALTER COLUMN bussines_name TYPE varchar(100),
            ALTER COLUMN contact_name TYPE varchar(100),
            ALTER COLUMN phone TYPE varchar(30);
            """
        )


class Migration(migrations.Migration):

    dependencies = [
        ("purchases", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(expand_supplier_text_fields, migrations.RunPython.noop),
    ]
