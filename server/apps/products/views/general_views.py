from rest_framework.generics import ListAPIView

from apps.products.serializers import CategorySerializer


class CategoryListAPIView(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        model = self.get_serializer().Meta.model
        queryset = model.objects.filter(state=True)
        type_param = self.request.query_params.get("type")
        if type_param:
            queryset = queryset.filter(type=type_param)
        return queryset
