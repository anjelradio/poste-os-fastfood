from rest_framework.generics import ListAPIView

from apps.inventory.serializers import MeasureUnitSerializer, RawMaterialSerializer


class MeasureUnitListAPIView(ListAPIView):
    serializer_class = MeasureUnitSerializer

    def get_queryset(self):
        model = self.get_serializer().Meta.model
        return model.objects.filter(state=True)


class RawMaterialListAPIView(ListAPIView):
    serializer_class = RawMaterialSerializer

    def get_queryset(self):
        model = self.get_serializer().Meta.model
        return model.objects.filter(state=True)
