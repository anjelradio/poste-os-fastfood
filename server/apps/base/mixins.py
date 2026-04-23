from rest_framework.response import Response
from rest_framework import status


class ErrorResponseMixin:
    def format_errors(self, serializer_errors):
        """Convierte errores del serializer en un array de strings."""
        messages = []
        for field, errors in serializer_errors.items():
            if isinstance(errors, list):
                messages.extend(errors)
            else:
                for error in errors:
                    messages.append(str(error))
        return messages
    
    def error_response(self, serializer_errors, message=None):
        """Retorna Response con errores formateados."""
        errors = self.format_errors(serializer_errors)
        if message:
            errors.insert(0, message)
        return Response(
            {"errors": errors},
            status=status.HTTP_400_BAD_REQUEST
        )
