from django.db import migrations


def populate_order_client(apps, schema_editor):
    Client = apps.get_model("orders", "Client")
    Order = apps.get_model("orders", "Order")

    clients_by_name = {}

    for order in Order.objects.all().iterator():
        normalized_name = (order.client_name or "").strip()
        if not normalized_name:
            continue

        client = clients_by_name.get(normalized_name)
        if client is None:
            client = Client.objects.filter(name=normalized_name, state=True).first()
            if client is None:
                client = Client.objects.create(name=normalized_name)
            clients_by_name[normalized_name] = client

        order.client_id = client.id
        order.client_name = client.name
        order.save(update_fields=["client", "client_name"])


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0007_client_order_client"),
    ]

    operations = [
        migrations.RunPython(populate_order_client, migrations.RunPython.noop),
    ]
